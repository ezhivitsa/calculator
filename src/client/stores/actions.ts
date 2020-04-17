import { CalculatorAdapter } from 'adapters/calculator';

import { ValueChangedEvent, OperationAddedEvent } from './types';

export enum Parentheses {
  LEFT = '(',
  RIGHT = ')',
}

export enum MathAction {
  DIVIDE = '÷',
  MULTIPLY = '×',
  MINUS = '−',
  PLUS = '+',
  PERCENT = '%',
}

export enum MathModifier {
  PERCENT = '%',
  FACTORIAL = 'factorial',
  SIN = 'sin',
  ASIN = 'asin',
  LN = 'ln',
  COS = 'cos',
  ACOS = 'acos',
  LOG = 'log',
  TAN = 'tan',
  ATAN = 'atan',
  SQUARE_ROOT = 'square-root',
  EXP = 'exp',
}

type Expression = BinaryExpression | SingleExpression;

type Value = string | Expression;

interface SingleExpression {
  value: Value;
  modifier: MathModifier;
  parent: Expression | null;
}

interface BinaryExpression {
  left: Value;
  operation: MathAction | null;
  right: Value;
  parent: Expression | null;
}

const PRIORITY_ACTIONS = [MathAction.MULTIPLY, MathAction.DIVIDE];

const PREFIX_MODIFIER = [
  MathModifier.SIN,
  MathModifier.ASIN,
  MathModifier.LN,
  MathModifier.COS,
  MathModifier.ACOS,
  MathModifier.LOG,
  MathModifier.TAN,
  MathModifier.ATAN,
  MathModifier.SQUARE_ROOT,
  MathModifier.EXP,
];

function instanceofBinaryExpression(object: Expression): object is BinaryExpression {
  return 'left' in object && 'right' in object;
}

function instanceofSingleExpression(object: Expression): object is SingleExpression {
  return 'value' in object;
}

export class ActionsStore {
  _rootExpression: BinaryExpression = {
    left: '',
    operation: null,
    right: '',
    parent: null,
  };
  private _expression: Expression;

  private _calculator: CalculatorAdapter = new CalculatorAdapter();

  constructor() {
    this._expression = this._rootExpression;
  }

  private _getValue(value: Value): Promise<string | null> {
    if (typeof value == 'string') {
      return Promise.resolve(value ? value : null);
    }

    return this._calculateExpression(value);
  }

  private async _calculateBinaryExpression(expression: BinaryExpression): Promise<string | null> {
    const { left, right, operation } = expression;
    const leftValue = await this._getValue(left);
    const rightValue = await this._getValue(right);

    if (leftValue && !operation && !rightValue) {
      return leftValue;
    }

    if (!(leftValue && rightValue && operation)) {
      return null;
    }

    switch (operation) {
      case MathAction.PLUS:
        return this._calculator.add(leftValue, rightValue);

      case MathAction.MINUS:
        return this._calculator.subtract(leftValue, rightValue);

      case MathAction.DIVIDE:
        return this._calculator.divide(leftValue, rightValue);

      case MathAction.MULTIPLY:
        return this._calculator.multiply(leftValue, rightValue);

      default:
        return null;
    }
  }

  private async _calculateSingleExpression(expression: SingleExpression): Promise<string | null> {
    const { value, modifier } = expression;
    const valueString = await this._getValue(value);

    if (!valueString) {
      return null;
    }

    console.log(valueString);
    switch (modifier) {
      case MathModifier.ACOS:
        return this._calculator.acos(valueString);
      default:
        return null;
    }
  }

  private async _calculateExpression(expression: BinaryExpression | SingleExpression): Promise<string | null> {
    if (instanceofBinaryExpression(expression)) {
      return this._calculateBinaryExpression(expression);
    }

    if (instanceofSingleExpression(expression)) {
      return this._calculateSingleExpression(expression);
    }

    return null;
  }

  private _addActionForBinaryExpression(currentExpression: BinaryExpression, action: MathAction): void {
    const { left, operation, right } = currentExpression;

    if (operation === null) {
      currentExpression.operation = action;
      return;
    }

    if (PRIORITY_ACTIONS.includes(action)) {
      const expression: BinaryExpression = {
        left: right,
        operation: action,
        right: '',
        parent: this._expression,
      };
      currentExpression.right = expression;
      this._expression = expression;
    } else {
      currentExpression.left = {
        left,
        operation,
        right,
        parent: this._expression,
      };
      currentExpression.operation = action;
      currentExpression.right = '';
    }
  }

  private _addActionForSingleExpression(currentExpression: SingleExpression, action: MathAction): void {
    const { value } = currentExpression;

    const expression = {
      left: value,
      operation: action,
      right: '',
      parent: this._expression,
    };
    currentExpression.value = expression;
    this._expression = expression;
  }

  private _addPrefixModifierForBinaryExpression(currentExpression: BinaryExpression, modifier: MathModifier): void {
    const expression: SingleExpression = {
      modifier,
      value: '',
      parent: this._expression,
    };

    const { left, right } = currentExpression;
    if (!left) {
      currentExpression.left = expression;
      this._expression = expression;
      return;
    }

    if (!right) {
      currentExpression.right = expression;
      this._expression = expression;
      return;
    }

    //this.handleOperationAdded(MathAction.MULTIPLY);
    this.addModifier(modifier);
    return;
  }

  private _addPrefixModifierForSingleExpression(currentExpression: SingleExpression, modifier: MathModifier): void {
    const expression: SingleExpression = {
      modifier,
      value: '',
      parent: this._expression,
    };

    const { value } = currentExpression;

    if (!value) {
      currentExpression.value = expression;
      this._expression = expression;
      return;
    }

    //this.handleOperationAdded(MathAction.MULTIPLY);
    this.addModifier(modifier);
  }

  private _addPostfixModifierForBinaryExpression(currentExpression: BinaryExpression, modifier: MathModifier): void {}

  private _addPostfixModifierForSingleExpression(currentExpression: SingleExpression, modifier: MathModifier): void {}

  private _addLeftParenthesesForBinaryExpression(currentExpression: BinaryExpression): void {
    const { left, operation, right } = currentExpression;
    const expression: BinaryExpression = {
      left: '',
      operation: null,
      right: '',
      parent: this._expression,
    };

    if (!left) {
      currentExpression.left = expression;
      this._expression = expression;
      return;
    }

    if (!operation) {
      currentExpression.operation = MathAction.MULTIPLY;
      currentExpression.right = expression;
      this._expression = expression;
      return;
    }

    if (!right) {
      currentExpression.right = expression;
      this._expression = expression;
      return;
    }

    const rightExpression = {
      left: right,
      operation: MathAction.MULTIPLY,
      right: expression,
      parent: this._expression,
    };
    expression.parent = rightExpression;
    currentExpression.right = rightExpression;
    this._expression = expression;
  }

  private _addLeftParenthesesForSingleExpression(currentExpression: SingleExpression): void {
    const { value } = currentExpression;
    const expression: BinaryExpression = {
      left: '',
      operation: null,
      right: '',
      parent: this._expression,
    };

    if (!value) {
      currentExpression.value = expression;
      this._expression = expression;
      return;
    }

    const valueExpression = {
      left: value,
      operation: MathAction.MULTIPLY,
      right: expression,
      parent: this._expression,
    };
    expression.parent = valueExpression;
    currentExpression.value = valueExpression;
    this._expression = expression;
  }

  addRightParentheses(): void {
    const { parent } = this._expression;
    if (!parent) {
      return;
    }

    if (instanceofBinaryExpression(this._expression)) {
      const { left, operation, right } = this._expression;

      if (!left || (operation && !right)) {
        return;
      }
    }

    if (instanceofSingleExpression(this._expression)) {
      const { value } = this._expression;
      if (!value) {
        return;
      }
    }

    this._expression = parent;
  }

  get lastValue(): string {
    if (instanceofBinaryExpression(this._expression)) {
      const { left, operation, right } = this._expression;
      if (operation === null) {
        return left as string;
      } else {
        return right as string;
      }
    }

    if (instanceofSingleExpression(this._expression)) {
      const { value } = this._expression;
      return value as string;
    }

    return '';
  }

  get closedParentheses(): boolean {
    if (instanceofBinaryExpression(this._expression)) {
      return typeof this._expression.right !== 'string';
    }

    if (instanceofSingleExpression(this._expression)) {
      return typeof this._expression.value !== 'string';
    }

    return false;
  }

  handleValueChanged({ value }: ValueChangedEvent): void {
    if (instanceofBinaryExpression(this._expression)) {
      if (this._expression.operation === null) {
        this._expression.left = value;
      } else {
        this._expression.right = value;
      }
    }

    if (instanceofSingleExpression(this._expression)) {
      this._expression.value = value;
    }
  }

  handleOperationAdded({ operation }: OperationAddedEvent): void {
    if (instanceofBinaryExpression(this._expression)) {
      return this._addActionForBinaryExpression(this._expression, operation);
    }

    if (instanceofSingleExpression(this._expression)) {
      return this._addActionForSingleExpression(this._expression, operation);
    }
  }

  handleLeftParenthesesAdded(): void {
    if (instanceofBinaryExpression(this._expression)) {
      return this._addLeftParenthesesForBinaryExpression(this._expression);
    }

    if (instanceofSingleExpression(this._expression)) {
      return this._addLeftParenthesesForSingleExpression(this._expression);
    }
  }

  addModifier(modifier: MathModifier): void {
    if (PREFIX_MODIFIER.includes(modifier)) {
      if (instanceofBinaryExpression(this._expression)) {
        return this._addPrefixModifierForBinaryExpression(this._expression, modifier);
      }

      if (instanceofSingleExpression(this._expression)) {
        return this._addPrefixModifierForSingleExpression(this._expression, modifier);
      }
    } else {
      if (instanceofBinaryExpression(this._expression)) {
        return this._addPostfixModifierForBinaryExpression(this._expression, modifier);
      }

      if (instanceofSingleExpression(this._expression)) {
        return this._addPostfixModifierForSingleExpression(this._expression, modifier);
      }
    }
  }

  calculateResult(): Promise<string | null> {
    return this._calculateExpression(this._rootExpression);
  }
}

export const actionsStore = new ActionsStore();

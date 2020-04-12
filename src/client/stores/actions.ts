import { CalculatorAdapter } from 'adapters/calculator';

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
}

type Value = string | Expression;

interface Expression {
  left: Value;
  operation: MathAction | null;
  right: Value;
  parent: Expression | null;
}

const PRIORITY_ACTIONS = [MathAction.MULTIPLY, MathAction.DIVIDE];

export class ActionsStore {
  _rootExpression: Expression = {
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

  private async _calculateExpression(expression: Expression): Promise<string | null> {
    const { left, right, operation } = expression;
    const leftValue = await this._getValue(left);
    const rightValue = await this._getValue(right);

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

  addLeftParentheses(): void {
    const { left, operation, right } = this._expression;
    const expression: Expression = {
      left: '',
      operation: null,
      right: '',
      parent: this._expression,
    };

    if (!left) {
      this._expression.left = expression;
      this._expression = expression;
      return;
    }

    if (!operation) {
      this._expression.operation = MathAction.MULTIPLY;
      this._expression.right = expression;
      this._expression = expression;
      return;
    }

    if (!right) {
      this._expression.right = expression;
      this._expression = expression;
      return;
    }

    const rightExpression = {
      left: this._expression.right,
      operation: MathAction.MULTIPLY,
      right: expression,
      parent: this._expression,
    };
    expression.parent = rightExpression;
    this._expression.right = rightExpression;
    this._expression = expression;
  }

  addRightParentheses(): void {
    const { left, operation, right, parent } = this._expression;
    if (!left || (operation && !right) || !parent) {
      return;
    }

    this._expression = parent;
  }

  get lastValue(): string {
    const { left, operation, right } = this._expression;
    if (operation === null) {
      return left as string;
    } else {
      return right as string;
    }
  }

  get closedParentheses(): boolean {
    return typeof this._expression.right !== 'string';
  }

  setValue(value: string): void {
    if (this._expression.operation === null) {
      this._expression.left = value;
    } else {
      this._expression.right = value;
    }
  }

  addAction(action: MathAction): void {
    const { left, operation, right } = this._expression;

    if (!left || (operation !== null && !right)) {
      return;
    }
    if (operation === null) {
      this._expression.operation = action;
      return;
    }

    if (PRIORITY_ACTIONS.includes(action)) {
      const expression: Expression = {
        left: right,
        operation: action,
        right: '',
        parent: this._expression,
      };
      this._expression.right = expression;
      this._expression = expression;
    } else {
      this._expression.left = {
        left,
        operation,
        right,
        parent: this._expression,
      };
      this._expression.operation = action;
      this._expression.right = '';
    }
  }

  calculateResult(): Promise<string | null> {
    return this._calculateExpression(this._rootExpression);
  }
}

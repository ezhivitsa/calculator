import { action, observable, computed } from 'mobx';

import { handle } from 'services/event-bus';

import { operationTexts } from 'texts';

import {
  ValueChangedEvent,
  OperationAddedEvent,
  MathModifier,
  ModifierAddedEvent,
  ResultCalculatedEvent,
  MathConstantAddedEvent,
  MathConstant,
  ExpressionValue,
  EventType,
  MathOperation,
} from './types';
import { PREFIX_MODIFIERS } from './constants';

type RepresentationValue = string | ExpressionValue;

const operationPresentation: {
  readonly [key in MathOperation]: string;
} = {
  [MathOperation.Divide]: operationTexts.divide,
  [MathOperation.Multiply]: operationTexts.multiply,
  [MathOperation.Minus]: operationTexts.minus,
  [MathOperation.Plus]: operationTexts.plus,
};

const modifierRepresentation: {
  readonly [key in MathModifier]: RepresentationValue;
} = {
  [MathModifier.PERCENT]: '%',
  [MathModifier.FACTORIAL]: '!',
  [MathModifier.SIN]: 'sin(',
  [MathModifier.ASIN]: 'arcsin(',
  [MathModifier.LN]: 'ln(',
  [MathModifier.COS]: 'cos(',
  [MathModifier.ACOS]: 'arccos(',
  [MathModifier.LOG]: 'log(',
  [MathModifier.TAN]: 'tan(',
  [MathModifier.ATAN]: 'arctan(',
  [MathModifier.SQUARE_ROOT]: '√(',
  [MathModifier.EXP]: 'E',
};

const constantRepresentation: {
  readonly [key in MathConstant]: RepresentationValue;
} = {
  [MathConstant.PI]: {
    value: 'π',
    bold: true,
  },
  [MathConstant.E]: {
    value: 'e',
    bold: true,
  },
  [MathConstant.ANSWER]: 'Ans',
  [MathConstant.RANDOM]: 'Rnd',
};

const START_VALUE = '0';
const ERROR = 'Error';

export class PresentationStore {
  @observable private _expression: ExpressionValue[] = [];
  @observable private _notClosedParentheses = 0;
  @observable private _result = '';

  constructor() {
    this._initHandlers();
  }

  private _initHandlers(): void {
    handle(EventType.VALUE_CHANGED, this._handleValueChanged);
    handle(EventType.MATH_OPERATION_ADDED, this._handleOperationAdded);
    handle(EventType.LEFT_PARENTHESES_ADDED, this._handleLeftParenthesesAdded);
    handle(EventType.RIGHT_PARENTHESES_ADDED, this._handleRightParenthesesAdded);
    handle(EventType.MODIFIER_ADDED, this._handleModifierAdded);
    handle(EventType.MATH_CONSTANT_ADDED, this._handleMathConstantAdded);
    handle(EventType.RESULT_CALCULATED, this._handleResultCalculated);
  }

  @computed
  get showResult(): boolean {
    return Boolean(this._result);
  }

  @computed
  get expression(): ExpressionValue[] {
    return this._expression.length ? this._expression : [{ value: START_VALUE, bold: false }];
  }

  @computed
  get imaginaryEnd(): string {
    return ''.padEnd(this._notClosedParentheses, ')');
  }

  @computed
  get result(): string {
    return this._result;
  }

  private _addToExpression(value: RepresentationValue): void {
    const valueToAdd =
      typeof value === 'string'
        ? {
            value,
            bold: false,
          }
        : value;

    if (!this._expression.length) {
      this._expression.push(valueToAdd);
      return;
    }

    const lastValue = this._expression[this._expression.length - 1];
    if (lastValue.bold === valueToAdd.bold) {
      lastValue.value += valueToAdd.value;
    } else {
      this._expression.push(valueToAdd);
    }
  }

  @action
  private _handleValueChanged = ({ addedValue, value }: ValueChangedEvent): void => {
    if (!this._expression) {
      this._addToExpression(value);
    } else {
      this._addToExpression(addedValue);
    }
  };

  @action
  private _handleOperationAdded = ({ operation }: OperationAddedEvent): void => {
    this._addToExpression(` ${operationPresentation[operation]} `);
  };

  @action
  private _handleLeftParenthesesAdded = (): void => {
    this._addToExpression('(');
    this._notClosedParentheses += 1;
  };

  @action
  private _handleRightParenthesesAdded = (): void => {
    this._addToExpression(')');
    this._notClosedParentheses -= 1;
  };

  @action
  private _handleModifierAdded = ({ modifier }: ModifierAddedEvent): void => {
    const isPrefix = PREFIX_MODIFIERS.includes(modifier);
    this._addToExpression(`${isPrefix ? ' ' : ''}${modifierRepresentation[modifier]}`);
    if (isPrefix) {
      this._notClosedParentheses += 1;
    }
  };

  @action
  private _handleMathConstantAdded = ({ value, constant }: MathConstantAddedEvent): void => {
    if (constant === MathConstant.RANDOM && value) {
      this._addToExpression(value);
    } else {
      this._addToExpression(constantRepresentation[constant]);
    }
  };

  @action
  private _handleResultCalculated = ({ result }: ResultCalculatedEvent): void => {
    this._result = result || ERROR;
  };

  @action
  handleResultCleared(): void {
    this._result = '';
  }

  @action
  dispose(): void {
    this._expression = [];
    this._notClosedParentheses = 0;
  }
}

export const presentationStore = new PresentationStore();

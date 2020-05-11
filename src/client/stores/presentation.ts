import { action, observable, computed } from 'mobx';

import { handle } from 'services/event-bus';

import { countParenthesis } from 'lib/strings';

import { operationTexts, expressionTexts } from 'texts';

import {
  ValueChangedEvent,
  OperationAddedEvent,
  PrefixModifierAddedEvent,
  PostfixModifierAddedEvent,
  ResultCalculatedEvent,
  MathConstantAddedEvent,
  EventType,
  ExponentValueChangedEvent,
} from 'services/types';
import { PrefixModifier, MathConstant, ExpressionValue, MathOperation, PostfixModifier } from './types';

type RepresentationValue = { value: string; bold: boolean } | string;

const operationPresentation: {
  readonly [key in MathOperation]: RepresentationValue;
} = {
  [MathOperation.Divide]: operationTexts.divide,
  [MathOperation.Multiply]: operationTexts.multiply,
  [MathOperation.Minus]: operationTexts.minus,
  [MathOperation.Plus]: operationTexts.plus,
};

const prefixModifierRepresentation: {
  readonly [key in PrefixModifier]: RepresentationValue;
} = {
  [PrefixModifier.Sin]: `${expressionTexts.sin}${expressionTexts.leftParentheses}`,
  [PrefixModifier.Asin]: `${expressionTexts.asin}${expressionTexts.leftParentheses}`,
  [PrefixModifier.Ln]: `${expressionTexts.ln}${expressionTexts.leftParentheses}`,
  [PrefixModifier.Cos]: `${expressionTexts.cos}${expressionTexts.leftParentheses}`,
  [PrefixModifier.Acos]: `${expressionTexts.acos}${expressionTexts.leftParentheses}`,
  [PrefixModifier.Log]: `${expressionTexts.log}${expressionTexts.leftParentheses}`,
  [PrefixModifier.Tan]: `${expressionTexts.tan}${expressionTexts.leftParentheses}`,
  [PrefixModifier.Atan]: `${expressionTexts.atan}${expressionTexts.leftParentheses}`,
  [PrefixModifier.SquareRoot]: `${expressionTexts.squareRoot}${expressionTexts.leftParentheses}`,
};

const postfixModifierRepresentation: {
  readonly [key in PostfixModifier]: RepresentationValue;
} = {
  [PostfixModifier.Factorial]: expressionTexts.factorial,
  [PostfixModifier.Percent]: expressionTexts.percent,
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
  @observable private _result = '';
  @observable private _currentLevel = 0;

  constructor() {
    this._initHandlers();
  }

  private _initHandlers(): void {
    handle(EventType.INITIALIZED, this._handleInitialized);
    handle(EventType.VALUE_CHANGED, this._handleValueChanged);
    handle(EventType.MATH_OPERATION_ADDED, this._handleOperationAdded);
    handle(EventType.LEFT_PARENTHESES_ADDED, this._handleLeftParenthesesAdded);
    handle(EventType.RIGHT_PARENTHESES_ADDED, this._handleRightParenthesesAdded);
    handle(EventType.PREFIX_MODIFIER_ADDED, this._handleModifierAdded);
    handle(EventType.MATH_CONSTANT_ADDED, this._handleMathConstantAdded);
    handle(EventType.RESULT_CALCULATED, this._handleResultCalculated);
    handle(EventType.POSTFIX_MODIFIER_ADDED, this._handlePostfixModifierAdded);
    handle(EventType.EXPONENT_ADDED, this._handleExponentAdded);
    handle(EventType.EXPONENT_VALUE_CHANGED, this._handleExponentValueChanged);
    handle(EventType.POWER_ADDED, this._handlePowerAdded);
    handle(EventType.POWER_FINISHED, this._handlePowerFinished);
    handle(EventType.ROOT_ADDED, this._handleRootAdded);
  }

  private _getExpressionsToReplace(expressions: ExpressionValue[], start: number, level: number): ExpressionValue[] {
    let i = start + 1;

    const result: ExpressionValue[] = [];

    while (i < expressions.length && expressions[i].level >= level + 1) {
      result.push(expressions[i]);
      i += 1;
    }

    return this._updatePositions(result);
  }

  private _getPositionToInsert(expressions: ExpressionValue[], end: number): number {
    const operations = [
      operationPresentation[MathOperation.Divide],
      operationPresentation[MathOperation.Multiply],
      operationPresentation[MathOperation.Minus],
      operationPresentation[MathOperation.Plus],
    ];

    let pos = 0;
    let parentheses = 0;

    for (let i = end - 1; i >= 0; i -= 1) {
      const expression = expressions[i];
      parentheses += countParenthesis(expression.value);

      if (parentheses === 0 && operations.includes(expression.value.trim())) {
        pos = i + 1;
        break;
      }
    }

    return pos;
  }

  private _updatePositions(expressions: ExpressionValue[]): ExpressionValue[] {
    const result: ExpressionValue[] = [];

    for (let i = 0; i < expressions.length; i += 1) {
      const exp = expressions[i];

      if (exp.insertBefore) {
        const { level } = exp;
        const posToInsert = this._getPositionToInsert(result, i);
        result.splice(posToInsert, 0, exp);

        const expressionsToReplace = this._getExpressionsToReplace(expressions, i, level);
        result.splice(posToInsert, 0, ...expressionsToReplace);

        i += expressionsToReplace.length;
      } else {
        result.push(exp);
      }
    }

    return result;
  }

  @computed
  get showResult(): boolean {
    return Boolean(this._result);
  }

  @computed
  get expression(): ExpressionValue[] {
    const result = this._expression.length ? [...this._expression] : [{ value: START_VALUE, bold: false, level: 0 }];

    return this._updatePositions(result);
  }

  @computed
  get result(): string {
    return this._result;
  }

  @computed
  get showTemplateForNewLevel(): boolean {
    const expression = this._expression;
    const level = expression.length ? expression[expression.length - 1].level : 0;
    return level + 1 === this._currentLevel;
  }

  private _addToExpression(value: RepresentationValue, insertBefore = false): void {
    const valueToAdd: ExpressionValue =
      typeof value === 'string'
        ? {
            value,
            bold: false,
            level: this._currentLevel,
            insertBefore,
          }
        : {
            ...value,
            level: this._currentLevel,
            insertBefore,
          };

    if (!this._expression.length) {
      this._expression.push(valueToAdd);
      return;
    }

    // const lastValue = this._expression[this._expression.length - 1];
    // if (lastValue.bold === valueToAdd.bold && lastValue.level === valueToAdd.level) {
    //   lastValue.value += valueToAdd.value;
    // } else {

    // if (this._positionToInsert === null) {
    this._expression.push(valueToAdd);
    // } else {
    //   this._expression.splice(this._positionToInsert, 0, valueToAdd);
    //   this._positionToInsert += 1;
    // }
    // }
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
  };

  @action
  private _handleRightParenthesesAdded = (): void => {
    this._addToExpression(')');
  };

  @action
  private _handleModifierAdded = ({ modifier }: PrefixModifierAddedEvent): void => {
    this._addToExpression(` ${prefixModifierRepresentation[modifier]}`);
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
  private _handleInitialized = (): void => {
    this._expression = [];
    this._result = '';
    this._currentLevel = 0;
  };

  @action
  private _handlePostfixModifierAdded = ({ modifier }: PostfixModifierAddedEvent): void => {
    this._addToExpression(postfixModifierRepresentation[modifier]);
  };

  @action
  private _handleExponentAdded = (): void => {
    this._addToExpression(expressionTexts.exponent);
  };

  @action
  private _handleExponentValueChanged = ({ addedValue }: ExponentValueChangedEvent): void => {
    this._addToExpression(addedValue);
  };

  @action
  private _handlePowerAdded = (): void => {
    this._currentLevel += 1;
  };

  @action
  private _handlePowerFinished = (): void => {
    this._currentLevel -= 1;
  };

  @action
  private _handleRootAdded = (): void => {
    this._addToExpression(expressionTexts.squareRoot, true);
    this._currentLevel += 1;
  };
}

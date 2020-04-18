import { action, observable, computed } from 'mobx';

import {
  ValueChangedEvent,
  OperationAddedEvent,
  MathModifier,
  ModifierAddedEvent,
  ResultCalculatedEvent,
} from './types';
import { PREFIX_MODIFIER } from './constants';

type ModifierRepresentation = {
  readonly [key in MathModifier]: string;
};

const modifierRepresentation: ModifierRepresentation = {
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

const START_VALUE = '0';
const ERROR = 'error';

export class PresentationStore {
  @observable private _expression = '';
  @observable private _notClosedParentheses = 0;
  @observable private _result = '';

  @computed
  get showResult(): boolean {
    return Boolean(this._result);
  }

  @computed
  get expression(): string {
    return this._expression || START_VALUE;
  }

  @computed
  get imaginaryEnd(): string {
    return ''.padEnd(this._notClosedParentheses, ')');
  }

  @computed
  get result(): string {
    return this._result;
  }

  @action
  handleValueChanged({ addedValue, value }: ValueChangedEvent): void {
    if (!this._expression) {
      this._expression = value;
    } else {
      this._expression += addedValue;
    }
  }

  @action
  handleOperationAdded({ operation }: OperationAddedEvent): void {
    this._expression += ` ${operation} `;
  }

  @action
  handleLeftParenthesesAdded(): void {
    this._expression += '(';
    this._notClosedParentheses += 1;
  }

  @action
  handleRightParenthesesAdded(): void {
    this._expression += ')';
    this._notClosedParentheses -= 1;
  }

  @action
  handleModifierAdded({ modifier }: ModifierAddedEvent): void {
    const isPrefix = PREFIX_MODIFIER.includes(modifier);
    this._expression += `${isPrefix ? ' ' : ''}${modifierRepresentation[modifier]}`;
    if (isPrefix) {
      this._notClosedParentheses += 1;
    }
  }

  @action
  handleResultCalculated({ result }: ResultCalculatedEvent): void {
    this._result = result || ERROR;
  }

  @action
  dispose(): void {
    this._expression = '';
    this._notClosedParentheses = 0;
  }
}

export const presentationStore = new PresentationStore();

import { isNumber } from 'lib/numbers';

import { ValueChangedEvent, NumberValue, MathAction, OperationAddedEvent, ModifierAddedEvent } from './types';
import { PREFIX_MODIFIERS } from './constants';

const START_VALUE = '0';

interface Current {
  value: string;
  hasMinusSign: boolean;
  action: MathAction | null;
  isValueConstant: boolean;
}

const initialCurrent: Current = {
  value: '',
  hasMinusSign: false,
  action: null,
  isValueConstant: false,
};

export class ApplicationState {
  private _current: Current = {
    ...initialCurrent,
  };
  private _hasValues = false;
  private _numOpenedParentheses = 0;

  get currentValue(): string {
    return this._current.value;
  }

  handleValueChanged(event: ValueChangedEvent): void {
    this._current.value = event.value;
  }

  handleOperationAdded(event: OperationAddedEvent): void {
    this._hasValues = true;

    this._current = {
      ...initialCurrent,
      action: event.operation,
    };
  }

  handleLeftParenthesesAdded(): void {
    this._numOpenedParentheses += 1;
    this._hasValues = true;
    this._current = {
      ...initialCurrent,
    };
  }

  handleRightParenthesesAdded(): void {
    this._numOpenedParentheses -= 1;
  }

  handleModifierAdded(event: ModifierAddedEvent): void {
    this._hasValues = true;
    this._current = {
      ...initialCurrent,
    };

    if (PREFIX_MODIFIERS.includes(event.modifier)) {
      this._numOpenedParentheses += 1;
    }
  }

  handleMathConstantAdded(): void {
    this._current.isValueConstant = true;
  }

  newValue(value: string): string | null {
    const newValue =
      !this._hasValues && !this._current.value && value === NumberValue.DOT
        ? `${START_VALUE}.`
        : `${this._current.value}${value}`;

    if (!isNumber(newValue)) {
      return null;
    }

    return newValue;
  }

  canAddSign(operation: MathAction): boolean {
    if (operation !== MathAction.MINUS || this._current.hasMinusSign) {
      return false;
    }

    if (!this._current.value) {
      return true;
    }

    return false;
  }

  canAddOperation(): boolean {
    return isNumber(this._current.value) || this._current.isValueConstant;
  }

  canAddRightParentheses(): boolean {
    return (
      this._numOpenedParentheses > 0 &&
      (this._current.action === null || (this._current.action !== null && isNumber(this._current.value)))
    );
  }

  shouldAddMultiplyForConstant(): boolean {
    return this._current.isValueConstant;
  }

  isNumber(value: string): boolean {
    return isNumber(value);
  }

  dispose(): void {
    this._hasValues = false;
    this._numOpenedParentheses = 0;
    this._current = {
      ...initialCurrent,
    };
  }
}

import { isNumber } from 'lib/numbers';

import { ValueChangedEvent, NumberValue, MathAction, OperationAddedEvent, ModifierAddedEvent } from './types';
import { PREFIX_MODIFIER } from './constants';

const START_VALUE = '0';

export class ApplicationState {
  private _currentValue = '';
  private _hasMinusSign = false;
  private _hasValues = false;
  private _currentAction: MathAction | null = null;
  private _numOpenedParentheses = 0;

  get currentValue(): string {
    return this._currentValue;
  }

  handleValueChanged(event: ValueChangedEvent): void {
    this._currentValue = event.value;
  }

  handleOperationAdded(event: OperationAddedEvent): void {
    this._hasValues = true;
    this._currentValue = '';
    this._hasMinusSign = false;
    this._currentAction = event.operation;
  }

  handleLeftParenthesesAdded(): void {
    this._numOpenedParentheses += 1;
    this._currentValue = '';
    this._hasMinusSign = false;
    this._hasValues = true;
    this._currentAction = null;
  }

  handleRightParenthesesAdded(): void {
    this._numOpenedParentheses -= 1;
  }

  handleModifierAdded(event: ModifierAddedEvent): void {
    this._hasValues = true;
    this._currentValue = '';
    this._hasMinusSign = false;
    this._currentAction = null;

    if (PREFIX_MODIFIER.includes(event.modifier)) {
      this._numOpenedParentheses += 1;
    }
  }

  newValue(value: string): string | null {
    const newValue =
      !this._hasValues && !this._currentValue && value === NumberValue.DOT
        ? `${START_VALUE}.`
        : `${this._currentValue}${value}`;

    if (!isNumber(newValue)) {
      return null;
    }

    return newValue;
  }

  canAddSign(operation: MathAction): boolean {
    if (operation !== MathAction.MINUS || this._hasMinusSign) {
      return false;
    }

    if (!this._currentValue) {
      return true;
    }

    return false;
  }

  canAddOperation(): boolean {
    return isNumber(this._currentValue);
  }

  canAddRightParentheses(): boolean {
    return (
      this._numOpenedParentheses > 0 &&
      (this._currentAction === null || (this._currentAction !== null && isNumber(this._currentValue)))
    );
  }

  dispose(): void {
    this._currentValue = '';
    this._hasMinusSign = false;
    this._hasValues = false;
    this._currentAction = null;
    this._numOpenedParentheses = 0;
  }
}

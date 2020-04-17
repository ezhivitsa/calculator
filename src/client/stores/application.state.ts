import { isNumber } from 'lib/numbers';

import { ValueChangedEvent, NumberValue, MathAction, OperationAddedEvent } from './types';

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
  }

  newValue(value: string): string | null {
    const newValue = !this._hasValues && value !== NumberValue.DOT ? value : `${START_VALUE}.`;
    if (!isNumber(newValue)) {
      return null;
    }

    return newValue;
  }

  canAddSign(operation: MathAction): boolean {
    if (operation !== MathAction.MINUS || this._hasMinusSign) {
      return false;
    }

    if (
      (!this._hasValues && !this._currentValue) ||
      (this._hasValues && this._currentAction !== null && !this._currentValue)
    ) {
      return true;
    }

    return false;
  }

  canAddOperation(): boolean {
    return isNumber(this._currentValue);
  }
}

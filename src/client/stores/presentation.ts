import { action, observable, computed } from 'mobx';

import { ValueChangedEvent, OperationAddedEvent } from './types';

const START_VALUE = '0';

export class PresentationStore {
  @observable private _expression = '';
  @observable private _notClosedParentheses = 0;

  @computed
  get expression(): string {
    return this._expression || START_VALUE;
  }

  @computed
  get imaginaryEnd(): string {
    return ''.padEnd(this._notClosedParentheses, ')');
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
    this._expression += operation;
  }

  @action
  handleLeftParenthesesAdded(): void {
    this._expression += '(';
    this._notClosedParentheses += 1;
  }
}

export const presentationStore = new PresentationStore();

import { observable, computed, action } from 'mobx';

import { CalculationStore } from './calculation';

export enum NumberValue {
  ZERO = '0',
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  DOT = '.',
}

export enum MathAction {
  DIVIDE = '÷',
  MULTIPLY = '×',
  MINUS = '−',
  PLUS = '+',
}

export class CalculatorStore {
  @observable private _calculations: CalculationStore[];

  constructor() {
    this._calculations = [new CalculationStore()];
  }

  @computed
  get currentCalculation(): CalculationStore {
    return this._calculations[this._calculations.length - 1];
  }

  @action
  setNumber(value: NumberValue) {}

  @action
  calculateResult() {}
}

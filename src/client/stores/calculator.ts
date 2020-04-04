import { observable, computed } from 'mobx';

import { CalculationStore } from './calculation';

export class CalculatorStore {
  @observable private _calculations: CalculationStore[];

  constructor() {
    this._calculations = [new CalculationStore()];
  }

  @computed
  get currentCalculation(): CalculationStore {
    return this._calculations[this._calculations.length - 1];
  }
}

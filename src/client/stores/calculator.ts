import { observable, computed } from 'mobx';

import { Calculation } from './calculation';

export class Calculator {
  @observable private _calculations: Calculation[];

  constructor() {
    this._calculations = [new Calculation()];
  }

  @computed
  get currentCalculation(): Calculation {
    return this._calculations[this._calculations.length - 1];
  }
}

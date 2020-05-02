/* eslint-disable @typescript-eslint/camelcase */

import type { CalculationData } from 'pkg/calculator';
import { MathOperation } from 'stores/types';

export class CalculatorAdapter {
  private _calculatorPromise: Promise<CalculationData>;
  private _calculatorInstance: CalculationData | null = null;

  constructor() {
    this._calculatorPromise = this._init();
  }

  private async _init(): Promise<CalculationData> {
    const { CalculationData } = await import('../../../../pkg/calculator');

    this._calculatorInstance = CalculationData.new();
    return this._calculatorInstance;
  }

  private async _getInstance(): Promise<CalculationData> {
    let instance: CalculationData;
    if (this._calculatorInstance) {
      instance = this._calculatorInstance;
    } else {
      instance = await this._calculatorPromise;
    }
    return instance;
  }

  async setValue(value: string): Promise<void> {
    const instance = await this._getInstance();
    instance.set_value(value);
  }

  async setOperation(operation: MathOperation): Promise<void> {
    const instance = await this._getInstance();
    instance.set_operation(operation);
  }

  async addLeftParentheses(): Promise<void> {
    const instance = await this._getInstance();
    instance.add_left_parentheses();
  }

  async addRightParentheses(): Promise<void> {
    const instance = await this._getInstance();
    instance.add_right_parentheses();
  }

  async calculate(): Promise<string> {
    const instance = await this._getInstance();
    return instance.calculate();
  }

  async clean(): Promise<void> {
    const instance = await this._getInstance();
    return instance.clean();
  }
}

/* eslint-disable @typescript-eslint/camelcase */

import type { CalculationData } from 'pkg/calculator';
import { MathOperation, PrefixModifier, MeasurementType, PostfixModifier } from 'stores/types';

type Action<T> = {
  resolve: (data: T) => void;
  reject: () => void;
  callback: (instance: CalculationData) => T | Promise<T>;
};

export class CalculatorAdapter {
  private _calculatorInstance: CalculationData | null = null;
  private _actions: Action<any>[] = [];

  constructor() {
    this._init();
  }

  private async _init(): Promise<void> {
    const { CalculationData } = await import('../../../../pkg/calculator');
    this._calculatorInstance = CalculationData.new();

    this._executeActions(this._calculatorInstance);
  }

  private _executeActions(instance: CalculationData): void {
    while (this._actions.length) {
      const [action] = this._actions;

      const result = action.callback(instance);
      if (result instanceof Promise) {
        result.then(action.resolve).catch(action.reject);
      } else {
        action.resolve(result);
      }

      this._actions.splice(0, 1);
    }
  }

  private _addPromiseAction<T>(
    resolve: () => void,
    reject: () => void,
    callback: (instance: CalculationData) => T | Promise<T>,
  ): void {
    this._actions.push({ resolve, reject, callback });
  }

  private _waitInitInstance<T>(callback: (instance: CalculationData) => Promise<T> | T): Promise<T> | T {
    if (this._calculatorInstance) {
      return callback(this._calculatorInstance);
    }

    return new Promise((resolve, reject) => {
      this._addPromiseAction(resolve, reject, callback);
    });
  }

  setValue(value: string): void | Promise<void> {
    return this._waitInitInstance((instance: CalculationData) => {
      return instance.set_value(value);
    });
  }

  setOperation(operation: MathOperation): void | Promise<void> {
    return this._waitInitInstance((instance: CalculationData) => {
      return instance.set_operation(operation);
    });
  }

  addLeftParentheses(): void | Promise<void> {
    return this._waitInitInstance((instance: CalculationData) => {
      return instance.add_left_parentheses();
    });
  }

  addRightParentheses(): void | Promise<void> {
    return this._waitInitInstance((instance: CalculationData) => {
      return instance.add_right_parentheses();
    });
  }

  async calculate(): Promise<string> {
    return this._waitInitInstance((instance: CalculationData) => {
      try {
        const result = instance.calculate();
        return result;
      } catch (err) {
        return '';
      }
    });
  }

  async validate(): Promise<boolean> {
    return this._waitInitInstance((instance: CalculationData) => {
      return instance.validate();
    });
  }

  addConstant(value: string): void | Promise<void> {
    return this._waitInitInstance((instance: CalculationData) => {
      return instance.add_constant(value);
    });
  }

  addPrefixModifier(modifier: PrefixModifier): void | Promise<void> {
    return this._waitInitInstance((instance: CalculationData) => {
      return instance.add_prefix_modifier(modifier);
    });
  }

  addPostfixModifier(modifier: PostfixModifier): void | Promise<void> {
    return this._waitInitInstance((instance: CalculationData) => {
      return instance.add_postfix_modifier(modifier);
    });
  }

  async clean(): Promise<void> {
    return this._waitInitInstance((instance: CalculationData) => {
      return instance.clean();
    });
  }

  setMeasurement(measurement: MeasurementType): void | Promise<void> {
    return this._waitInitInstance((instance: CalculationData) => {
      return instance.set_measurement(measurement);
    });
  }

  addExponent(): void | Promise<void> {
    return this._waitInitInstance((instance: CalculationData) => {
      return instance.add_exp();
    });
  }

  setExponent(exponentValue: string): void | Promise<void> {
    return this._waitInitInstance((instance: CalculationData) => {
      return instance.set_power(exponentValue);
    });
  }
}

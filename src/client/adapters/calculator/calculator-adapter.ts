import { Calculator } from 'pkg/calculator.d.ts';

interface InitData {
  struct: typeof Calculator;
  instance: Calculator;
}

export class CalculatorAdapter {
  private _calculatorPromise: Promise<InitData>;

  private _calculatorStruct: typeof Calculator | null = null;
  private _calculatorInstance: Calculator | null = null;

  constructor() {
    this._calculatorPromise = this._init();
  }

  private async _init(): Promise<InitData> {
    const wasmCalculator = await import('../../../../pkg/calculator');

    this._calculatorStruct = wasmCalculator.Calculator;
    this._calculatorInstance = wasmCalculator.Calculator.new();

    return {
      struct: this._calculatorStruct,
      instance: this._calculatorInstance,
    };
  }

  private async _getInstance(): Promise<Calculator> {
    let instance: Calculator;
    if (this._calculatorInstance) {
      instance = this._calculatorInstance;
    } else {
      instance = (await this._calculatorPromise).instance;
    }
    return instance;
  }

  private async _getStruct(): Promise<typeof Calculator> {
    let struct: typeof Calculator;
    if (this._calculatorStruct) {
      struct = this._calculatorStruct;
    } else {
      struct = (await this._calculatorPromise).struct;
    }
    return struct;
  }

  async add(value: string): Promise<void> {
    const instance = await this._getInstance();
    instance.add(value);
  }

  async divide(value1: string, value2: string): Promise<string> {
    const struct = await this._getStruct();
    return struct.divide(value1, value2);
  }

  async multiply(value1: string, value2: string): Promise<string> {
    const struct = await this._getStruct();
    return struct.multiply(value1, value2);
  }

  async reset(): Promise<void> {
    const instance = await this._getInstance();
    instance.reset();
  }

  async result(): Promise<string> {
    const instance = await this._getInstance();
    return instance.result();
  }
}

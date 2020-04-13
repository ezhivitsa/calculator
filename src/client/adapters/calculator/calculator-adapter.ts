interface CalculatorActions {
  add: (value1: string, value2: string) => string;
  subtract: (value1: string, value2: string) => string;
  divide: (value1: string, value2: string) => string;
  multiply: (value1: string, value2: string) => string;
  arccos: (value: string) => string;
}

export class CalculatorAdapter {
  private _calculatorPromise: Promise<CalculatorActions>;
  private _calculatorInstance: CalculatorActions | null = null;

  constructor() {
    this._calculatorPromise = this._init();
  }

  private async _init(): Promise<CalculatorActions> {
    const { add, subtract, divide, multiply, arccos } = await import('../../../../pkg/calculator');

    this._calculatorInstance = {
      add,
      subtract,
      divide,
      multiply,
      arccos,
    };
    return this._calculatorInstance;
  }

  private async _getInstance(): Promise<CalculatorActions> {
    let instance: CalculatorActions;
    if (this._calculatorInstance) {
      instance = this._calculatorInstance;
    } else {
      instance = await this._calculatorPromise;
    }
    return instance;
  }

  async add(value1: string, value2: string): Promise<string> {
    const instance = await this._getInstance();
    return instance.add(value1, value2);
  }

  async subtract(value1: string, value2: string): Promise<string> {
    const instance = await this._getInstance();
    return instance.subtract(value1, value2);
  }

  async divide(value1: string, value2: string): Promise<string> {
    const instance = await this._getInstance();
    return instance.divide(value1, value2);
  }

  async multiply(value1: string, value2: string): Promise<string> {
    const instance = await this._getInstance();
    return instance.multiply(value1, value2);
  }

  async acos(value: string): Promise<string | null> {
    const instance = await this._getInstance();
    const result = instance.arccos(value);
    return result ? result : null;
  }
}

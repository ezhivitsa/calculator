/* eslint-disable @typescript-eslint/camelcase */
interface CalculatorActions {
  add: (value1: string, value2: string) => string;
  subtract: (value1: string, value2: string) => string;
  divide: (value1: string, value2: string) => string;
  multiply: (value1: string, value2: string) => string;
  cos: (value: string) => string;
  arccos: (value: string) => string;
  sin: (value: string) => string;
  arcsin: (value: string) => string;
  ln: (value: string) => string;
  log: (value: string) => string;
  tan: (value: string) => string;
  arctan: (value: string) => string;
  sqrt: (value: string) => string;
}

export class CalculatorAdapter {
  private _calculatorPromise: Promise<CalculatorActions>;
  private _calculatorInstance: CalculatorActions | null = null;

  constructor() {
    this._calculatorPromise = this._init();
  }

  private async _init(): Promise<CalculatorActions> {
    const {
      add,
      subtract,
      divide,
      multiply,
      calc_cos,
      calc_arccos,
      calc_sin,
      calc_arcsin,
      calc_ln,
      calc_log,
      calc_tan,
      calc_arctan,
      calc_sqrt,
    } = await import('../../../../pkg/calculator');

    this._calculatorInstance = {
      add,
      subtract,
      divide,
      multiply,
      cos: calc_cos,
      arccos: calc_arccos,
      sin: calc_sin,
      arcsin: calc_arcsin,
      ln: calc_ln,
      log: calc_log,
      tan: calc_tan,
      arctan: calc_arctan,
      sqrt: calc_sqrt,
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

  async cos(value: string): Promise<string | null> {
    const instance = await this._getInstance();
    const result = instance.cos(value);
    return result ? result : null;
  }
  async acos(value: string): Promise<string | null> {
    const instance = await this._getInstance();
    const result = instance.arccos(value);
    return result ? result : null;
  }
  async sin(value: string): Promise<string | null> {
    const instance = await this._getInstance();
    const result = instance.sin(value);
    return result ? result : null;
  }
  async asin(value: string): Promise<string | null> {
    const instance = await this._getInstance();
    const result = instance.arcsin(value);
    return result ? result : null;
  }
  async ln(value: string): Promise<string | null> {
    const instance = await this._getInstance();
    const result = instance.ln(value);
    return result ? result : null;
  }
  async log(value: string): Promise<string | null> {
    const instance = await this._getInstance();
    const result = instance.log(value);
    return result ? result : null;
  }
  async tan(value: string): Promise<string | null> {
    const instance = await this._getInstance();
    const result = instance.tan(value);
    return result ? result : null;
  }
  async atan(value: string): Promise<string | null> {
    const instance = await this._getInstance();
    const result = instance.arctan(value);
    return result ? result : null;
  }
  async sqrt(value: string): Promise<string | null> {
    const instance = await this._getInstance();
    const result = instance.sqrt(value);
    return result ? result : null;
  }
}

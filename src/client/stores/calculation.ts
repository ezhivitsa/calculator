import { observable, computed, action } from 'mobx';

import { isNumber } from 'lib/numbers';

import { CalculatorAdapter } from 'adapters/calculator';

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
  PERCENT = '%',
}

export enum CleanAction {
  CLEAN_ONE = 'CE',
  CLEAN_RESULT = 'AC',
}

export enum Parentheses {
  LEFT = '(',
  RIGHT = ')',
}

interface Action {
  mathAction: MathAction | null;
  value: string;
}

const START_NUMBER = '0';
const PRIORITY_ACTIONS = [MathAction.DIVIDE, MathAction.MULTIPLY];

export class CalculationStore {
  @observable private _actions: Action[] = [];
  @observable private _result: string | null = null;
  @observable private _currentNumber = START_NUMBER;
  @observable private _currentMathAction: MathAction | null = null;

  private _calculator: CalculatorAdapter = new CalculatorAdapter();

  @computed
  get result(): string {
    return this._result ? this._result : '';
  }

  @computed
  get showResult(): boolean {
    return this._result !== null;
  }

  @computed
  get expression(): string {
    let result = this._actions
      .map((action) => {
        return action.mathAction ? `${action.mathAction} ${action.value}` : action.value;
      })
      .join(' ');

    if (this._currentMathAction) {
      result += ` ${this._currentMathAction}`;
    }

    if (this._currentNumber) {
      result += ` ${this._currentNumber}`;
    }

    return result;
  }

  @action
  setNumber(value: NumberValue): void {
    if (value !== NumberValue.DOT && this._currentNumber === START_NUMBER) {
      this._currentNumber = value;
      return;
    }

    const newNumber = this._currentNumber + value;
    if (isNumber(newNumber)) {
      this._currentNumber = newNumber;
    }
  }

  @action
  addAction(action: MathAction): void {
    if (action === MathAction.MINUS && [START_NUMBER, ''].includes(this._currentNumber)) {
      this._currentNumber = '-';
      return;
    }

    if (!isNumber(this._currentNumber)) {
      return;
    }

    this._actions.push({
      mathAction: this._currentMathAction,
      value: this._currentNumber,
    });

    this._currentMathAction = action;
    this._currentNumber = '';
  }

  @action
  cleanAll(): void {
    this._actions = [];
    this._currentMathAction = null;
    this._currentNumber = START_NUMBER;
  }

  @action
  clean(): void {
    const { _currentNumber, _actions } = this;
    if (_currentNumber.length > 1 || (_actions.length && _currentNumber.length)) {
      this._currentNumber = _currentNumber.slice(0, _currentNumber.length - 1);
      return;
    }

    if (!_currentNumber.length && _actions.length) {
      const action = _actions.pop() as Action;

      this._currentNumber = action.value;
      this._currentMathAction = action.mathAction;
    }

    if (!_actions.length && _currentNumber.length === 1) {
      this._currentNumber = START_NUMBER;
      this._currentMathAction = null;
    }
  }

  @action
  addParentheses(parentheses: Parentheses): void {}

  @action
  async calculateResult(): Promise<void> {
    const { _currentNumber, _currentMathAction, _actions } = this;

    if (isNumber(_currentNumber)) {
      this._actions.push({
        mathAction: _currentMathAction,
        value: _currentNumber,
      });

      this._currentNumber = '';
      this._currentMathAction = null;
    }

    await this._calculator.reset();

    const actions = [];
    for (let i = 0; i < _actions.length; i += 1) {
      const action = _actions[i];
      const nextAction = _actions[i + 1];

      if (nextAction && nextAction.mathAction && PRIORITY_ACTIONS.includes(nextAction.mathAction)) {
        let value: string;

        switch (nextAction.mathAction) {
          case MathAction.DIVIDE:
            value = await this._calculator.divide(action.value, nextAction.value);
            break;

          case MathAction.MULTIPLY:
            value = await this._calculator.multiply(action.value, nextAction.value);
            break;

          default:
            value = START_NUMBER;
        }

        actions.push({
          mathAction: action.mathAction,
          value,
        });
      } else {
        actions.push(action);
      }
    }

    for (const action of this._actions) {
      switch (action.mathAction) {
        case MathAction.PLUS:
        case null:
          await this._calculator.add(action.value);
          break;
      }
    }

    this._result = await this._calculator.result();
  }
}

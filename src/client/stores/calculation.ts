import { observable, computed, action, runInAction } from 'mobx';

import { isNumber } from 'lib/numbers';

import { ActionsStore, MathAction, Parentheses, MathModifier } from './actions';
import { CommandsStore } from './commands';

import { CommandType, Command } from './types';

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

export enum CleanAction {
  CLEAN_ONE = 'CE',
  CLEAN_RESULT = 'AC',
}

type ModifierRepresentation = {
  [key in MathModifier]: string;
};

const modifierRepresentation: ModifierRepresentation = {
  [MathModifier.PERCENT]: '%',
  [MathModifier.FACTORIAL]: '!',
  [MathModifier.SIN]: 'sin(',
  [MathModifier.ASIN]: 'arcsin(',
  [MathModifier.LN]: 'ln(',
  [MathModifier.COS]: 'cos(',
  [MathModifier.ACOS]: 'arccos(',
  [MathModifier.LOG]: 'log(',
  [MathModifier.TAN]: 'tan(',
  [MathModifier.ATAN]: 'arctan(',
  [MathModifier.SQUARE_ROOT]: '√(',
  [MathModifier.EXP]: 'E',
};

const START_NUMBER = '0';

export class CalculationStore {
  @observable private _result: string | null = null;

  private _commands: CommandsStore = new CommandsStore();

  private get _actions(): ActionsStore {
    return this._commands.actions;
  }

  @computed
  get result(): string {
    return this._result ? this._result : '';
  }

  @computed
  get showResult(): boolean {
    return this._result !== null;
  }

  @action
  setNumber(value: NumberValue): void {
    this._commands.send({
      type: CommandType.ADD_VALUE,
      value,
    });
  }

  @action
  addAction(action: MathAction): void {
    // if (action === MathAction.MINUS && [START_NUMBER, ''].includes(this._expression)) {
    //   this._actions.setValue('-');
    //   return;
    // }

    // if (!(this._actions.closedParentheses || isNumber(this._actions.lastValue))) {
    //   return;
    // }

    this._commands.send({
      type: CommandType.ADD_MATH_OPERATION,
      operation: action,
    });
    // this._expression += action;
  }

  @action
  addModifier(modifier: MathModifier): void {
    // this._commands.send({
    //   type: CommandType.ADD_MODIFIER,
    //   modifier,
    // });
    // this._expression += modifierRepresentation[modifier];
  }

  @action
  cleanAll(): void {
    this._commands.removeAllCommands();
    this._result = '';
    //this._result = null;
  }

  @action
  clean(): void {
    // this._commands.removeLastCommand();
    // this._expression = this._expression.slice(0, this._expression.length - 1);
  }

  @action
  addParentheses(parentheses: Parentheses): void {
    const command: Command =
      parentheses === Parentheses.LEFT
        ? {
            type: CommandType.ADD_LEFT_PARENTHESES,
          }
        : {
            type: CommandType.ADD_RIGHT_PARENTHESES,
          };
    this._commands.send(command);
  }

  @action
  async calculateResult(): Promise<void> {
    const result = await this._actions.calculateResult();
    runInAction(() => {
      this._result = result;
    });
  }
}

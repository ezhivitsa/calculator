import { observable, computed, action, runInAction } from 'mobx';

import { isNumber } from 'lib/numbers';

import { ActionsStore, MathAction, Parentheses, MathModifier } from './actions';
import { CommandsStore, CommandType, Command } from './commands';

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

const START_NUMBER = '0';

export class CalculationStore {
  @observable private _expression = '';
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

  @computed
  get expression(): string {
    return this._expression ? this._expression : START_NUMBER;
  }

  @action
  setNumber(value: NumberValue): void {
    if (value === NumberValue.DOT && this._expression === '') {
      this._expression += '0.';
      this._commands.addCommand({
        type: CommandType.SET_VALUE,
        value: '0.',
      });
      return;
    }

    if (this._actions.closedParentheses) {
      this._expression += value;
      this._commands.addCommands(
        {
          type: CommandType.ADD_MATH_OPERATION,
          operation: MathAction.MULTIPLY,
        },
        {
          type: CommandType.SET_VALUE,
          value,
        },
      );
      return;
    }

    const newNumber = this._actions.lastValue + value;
    if (isNumber(newNumber)) {
      this._expression += value;
      this._commands.addCommand({
        type: CommandType.SET_VALUE,
        value: newNumber,
      });
    }
  }

  @action
  addAction(action: MathAction): void {
    // if (action === MathAction.MINUS && [START_NUMBER, ''].includes(this._expression)) {
    //   this._actions.setValue('-');
    //   return;
    // }

    if (!(this._actions.closedParentheses || isNumber(this._actions.lastValue))) {
      return;
    }

    this._commands.addCommand({
      type: CommandType.ADD_MATH_OPERATION,
      operation: action,
    });
    this._expression += action;
  }

  @action
  addModifier(modifier: MathModifier): void {
    this._commands.addCommand({
      type: CommandType.ADD_MODIFIER,
      modifier,
    });
  }

  @action
  cleanAll(): void {
    this._commands.removeAllCommands();
    this._result = '';
    //this._result = null;
  }

  @action
  clean(): void {
    this._commands.removeLastCommand();
    this._expression = this._expression.slice(0, this._expression.length - 1);
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
    this._commands.addCommand(command);
    this._expression += parentheses;
  }

  @action
  async calculateResult(): Promise<void> {
    const result = await this._actions.calculateResult();
    runInAction(() => {
      this._result = result;
    });
  }
}

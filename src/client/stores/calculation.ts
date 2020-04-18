import { MathModifier } from './actions';
import { CommandsStore } from './commands';

import { CommandType, Command, MathAction, Parentheses, NumberValue } from './types';

export class CalculationStore {
  private _commands: CommandsStore = new CommandsStore();

  setNumber(value: NumberValue): void {
    this._commands.send({
      type: CommandType.ADD_VALUE,
      value,
    });
  }

  addAction(action: MathAction): void {
    this._commands.send({
      type: CommandType.ADD_MATH_OPERATION,
      operation: action,
    });
  }

  addModifier(modifier: MathModifier): void {
    this._commands.send({
      type: CommandType.ADD_MODIFIER,
      modifier,
    });
  }

  cleanAll(): void {
    this._commands.send({
      type: CommandType.REMOVE_ALL_SYMBOLS,
    });
  }

  clean(): void {
    this._commands.send({
      type: CommandType.REMOVE_SYMBOL,
    });
  }

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

  calculateResult(): void {
    this._commands.send({
      type: CommandType.CALCULATE_RESULT,
    });
  }
}

export const calculationStore = new CalculationStore();

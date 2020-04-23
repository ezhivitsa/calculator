import {
  CommandType,
  Command,
  AddValueCommand,
  AddMathOperationCommand,
  AddModifierCommand,
  AddConstantCommand,
} from './types';

import { ApplicationService } from './application.service';

export class CommandsStore {
  private _commands: Command[] = [];
  private _applicationService = new ApplicationService();

  private _applyCommand(command: Command): void {
    this._commands.push(command);

    switch (command.type) {
      case CommandType.ADD_VALUE:
        this._applicationService.handleSetValue(command as AddValueCommand);
        break;

      case CommandType.ADD_MATH_OPERATION:
        this._applicationService.handleAddOperation(command as AddMathOperationCommand);
        break;

      case CommandType.ADD_LEFT_PARENTHESES:
        this._applicationService.handleAddLeftParentheses();
        break;

      case CommandType.ADD_RIGHT_PARENTHESES:
        this._applicationService.handleAddRightParentheses();
        break;

      case CommandType.ADD_MODIFIER:
        this._applicationService.handleAddModifier(command as AddModifierCommand);
        break;

      case CommandType.REMOVE_SYMBOL:
        this._applicationService.handleRemoveSymbol();
        break;

      case CommandType.REMOVE_ALL_SYMBOLS:
        this._applicationService.handleRemoveAllSymbols();
        break;

      case CommandType.CALCULATE_RESULT:
        this._applicationService.handleCalculateResult();
        break;

      case CommandType.ADD_MATH_CONSTANT:
        this._applicationService.handleAddMathConstant(command as AddConstantCommand);
        break;
    }
  }

  send(...commands: Command[]): void {
    for (const command of commands) {
      this._applyCommand(command);
    }
  }
}

import { ActionsStore } from './actions';
import { CommandType, Command, AddValueCommand, AddMathOperationCommand, AddModifierCommand } from './types';

import { ApplicationService } from './application.service';

export class CommandsStore {
  private _commands: Command[] = [];
  private _actions: ActionsStore = new ActionsStore();
  private _applicationService = new ApplicationService();

  private _applyCommand(actionsStore: ActionsStore, command: Command): void {
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
    }
  }

  private _addCommand(command: Command): void {
    this._commands.push(command);
    this._applyCommand(this._actions, command);
    console.log(this._actions._rootExpression);
  }

  get actions(): ActionsStore {
    return this._actions;
  }

  send(...commands: Command[]): void {
    for (const command of commands) {
      this._addCommand(command);
    }
  }

  removeLastCommand(): void {
    this._commands.pop();
    this._actions = this.restoreActions();
  }

  removeAllCommands(): void {
    this._commands = [];
    this._actions = this.restoreActions();
  }

  restoreActions(): ActionsStore {
    const actionsStore = new ActionsStore();

    for (const command of this._commands) {
      this._applyCommand(actionsStore, command);
    }

    return actionsStore;
  }
}

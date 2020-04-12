import { ActionsStore, MathAction } from './actions';

export enum CommandType {
  SET_VALUE = 'set-value',
  ADD_MATH_OPERATION = 'add-math-operation',
  ADD_LEFT_PARENTHESES = 'add-left-parentheses',
  ADD_RIGHT_PARENTHESES = 'add-right-parentheses',
}

export type Command =
  | {
      type: CommandType.SET_VALUE;
      value: string;
    }
  | {
      type: CommandType.ADD_MATH_OPERATION;
      operation: MathAction;
    }
  | {
      type: CommandType.ADD_LEFT_PARENTHESES;
    }
  | {
      type: CommandType.ADD_RIGHT_PARENTHESES;
    };

export class CommandsStore {
  private _commands: Command[] = [];
  private _actions: ActionsStore = new ActionsStore();

  private _applyCommand(actionsStore: ActionsStore, command: Command): void {
    switch (command.type) {
      case CommandType.SET_VALUE:
        actionsStore.setValue(command.value);
        break;

      case CommandType.ADD_MATH_OPERATION:
        actionsStore.addAction(command.operation);
        break;

      case CommandType.ADD_LEFT_PARENTHESES:
        actionsStore.addLeftParentheses();
        break;

      case CommandType.ADD_RIGHT_PARENTHESES:
        actionsStore.addRightParentheses();
        break;
    }
  }

  get actions(): ActionsStore {
    return this._actions;
  }

  addCommand(command: Command): void {
    this._commands.push(command);
    this._applyCommand(this._actions, command);
    console.log(this._actions._rootExpression);
  }

  addCommands(...commands: Command[]): void {
    for (const command of commands) {
      this.addCommand(command);
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

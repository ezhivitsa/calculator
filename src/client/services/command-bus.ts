import { CommandType, Command, CommandTypeMapping } from 'stores/types';

type Handlers = {
  [key in CommandType]: ((command: CommandTypeMapping[key]) => void)[];
};

const commands: Command[] = [];
const handlers: Handlers = {
  [CommandType.ADD_VALUE]: [],
  [CommandType.ADD_MATH_OPERATION]: [],
  [CommandType.ADD_LEFT_PARENTHESES]: [],
  [CommandType.ADD_RIGHT_PARENTHESES]: [],
  [CommandType.ADD_MODIFIER]: [],
  [CommandType.REMOVE_SYMBOL]: [],
  [CommandType.REMOVE_ALL_SYMBOLS]: [],
  [CommandType.CALCULATE_RESULT]: [],
  [CommandType.ADD_MATH_CONSTANT]: [],
};

function processCommand<T extends CommandType>(command: CommandTypeMapping[T]): void {
  commands.push(command);

  const commandHandlers = handlers[command.type];
  for (const handler of commandHandlers) {
    (handler as (c: CommandTypeMapping[T]) => void)(command);
  }
}

export function handle<T extends CommandType>(
  commandType: T,
  commandHandler: (command: CommandTypeMapping[T]) => void,
): void {
  handlers[commandType].push(commandHandler as (c: any) => void);
}

export function send<T extends CommandType>(...commands: CommandTypeMapping[T][]): void {
  for (const command of commands) {
    processCommand(command);
  }
}

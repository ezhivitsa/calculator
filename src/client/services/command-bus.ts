import { CommandType, Command, CommandTypeMapping } from './types';

type Handlers = {
  [key in CommandType]?: ((command: CommandTypeMapping[key]) => void)[];
};

const commands: Command[] = [];
const handlers: Handlers = {};

function processCommand<T extends CommandType>(command: CommandTypeMapping[T]): void {
  commands.push(command);

  const commandHandlers = handlers[command.type] || [];
  for (const handler of commandHandlers) {
    (handler as (c: CommandTypeMapping[T]) => void)(command);
  }
}

export function handle<T extends CommandType>(
  commandType: T,
  commandHandler: (command: CommandTypeMapping[T]) => void,
): void {
  if (!handlers[commandType]) {
    handlers[commandType] = [];
  }

  const handlersArray = handlers[commandType];
  if (handlersArray) {
    handlersArray.push(commandHandler as (c: any) => void);
  }
}

export function send<T extends CommandType>(...commands: CommandTypeMapping[T][]): void {
  for (const command of commands) {
    processCommand(command);
  }
}

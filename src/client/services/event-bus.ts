import { EventType, EventTypeMapping } from './types';

import { addEvent, getEvents } from './event-store';

type Handlers = {
  [key in EventType]?: ((command: EventTypeMapping[key]) => void)[];
};

const handlers: Handlers = {};

function processEvent<T extends EventType>(event: EventTypeMapping[T]): void {
  const commandHandlers = handlers[event.type] || [];
  for (const handler of commandHandlers) {
    (handler as (c: EventTypeMapping[T]) => void)(event);
  }
}

export function handle<T extends EventType>(eventType: T, eventHandler: (command: EventTypeMapping[T]) => void): void {
  if (!handlers[eventType]) {
    handlers[eventType] = [];
  }

  const handlersArray = handlers[eventType];
  if (handlersArray) {
    handlersArray.push(eventHandler as (c: any) => void);
  }
}

export function apply<T extends EventType>(...events: EventTypeMapping[T][]): void {
  for (const event of events) {
    addEvent(event);
    processEvent(event);
  }
}

export function restore(): void {
  for (const event of getEvents()) {
    processEvent(event);
  }
}

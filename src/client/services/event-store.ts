import { Event, EventType } from './types';

const events: Event[] = [];

export function addEvent(event: Event): void {
  events.push(event);
}

export function getDataEvents(): Event[] {
  return events.filter((e) => e.type !== EventType.RESULT_CALCULATED && e.type !== EventType.INITIALIZED);
}

export function getEvents(): Event[] {
  return [...events];
}

export function removeAllEvents(): void {
  events.splice(1, events.length - 1);
}

export function removeLastEvent(): void {
  if (events.length && events[events.length - 1].type !== EventType.INITIALIZED) {
    events.pop();
  }
}

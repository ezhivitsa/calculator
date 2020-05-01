import { Event } from 'stores/types';

const events: Event[] = [];

export function addEvent(event: Event): void {
  events.push(event);
}

export function getEvents(): Event[] {
  return [...events];
}

export function removeAllEvents(): void {
  events.splice(0, events.length);
}

export function removeLastEvent(): void {
  if (events.length) {
    events.pop();
  }
}

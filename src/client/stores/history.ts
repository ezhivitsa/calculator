import { handle } from 'services/event-bus';

import { Event, ResultCalculatedEvent, EventType } from 'services/types';
import { ExpressionValue } from './types';

class CalculationHistory {
  private _expression: ExpressionValue[];
  private _result: string | null;
  private _events: Event[];

  constructor(expression: ExpressionValue[], result: string | null, events: Event[]) {
    this._expression = expression;
    this._result = result;
    this._events = events;
  }

  get expression(): ExpressionValue[] {
    return this._expression;
  }

  get result(): string | null {
    return this._result;
  }

  get events(): Event[] {
    return this._events;
  }

  setExpressionAsCurrent(): void {}

  setResultAsCurrent(): void {}
}

export class HistoryStore {
  private _history: CalculationHistory[] = [];

  constructor() {
    this._initHandlers();
  }

  get lastNumericResult(): string | null {
    for (let i = this._history.length - 1; i >= 0; i -= 1) {
      const historyItem = this._history[i];
      if (historyItem.result) {
        return historyItem.result;
      }
    }

    return null;
  }

  private _initHandlers(): void {
    handle(EventType.RESULT_CALCULATED, this._handleResultCalculated);
  }

  private _handleResultCalculated = ({ expression, result, events }: ResultCalculatedEvent): void => {
    this._history.push(new CalculationHistory(expression, result, events));
  };
}

export const historyStory = new HistoryStore();

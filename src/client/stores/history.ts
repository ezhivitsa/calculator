import { Event, ResultCalculatedEvent, ExpressionValue } from './types';

interface CalculationHistory {
  expression: ExpressionValue[];
  result: string | null;
  events: Event[];
}

export class HistoryStore {
  private _history: CalculationHistory[] = [];

  get lastNumericResult(): string | null {
    for (let i = this._history.length - 1; i >= 0; i -= 1) {
      const historyItem = this._history[i];
      if (historyItem.result) {
        return historyItem.result;
      }
    }

    return null;
  }

  handleResultCalculated({ expression, result, events }: ResultCalculatedEvent): void {
    this._history.push({
      expression,
      result,
      events,
    });
  }
}

export const historyStory = new HistoryStore();

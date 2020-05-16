import { observable, action, computed } from 'mobx';

import { handle } from 'services/event-bus';
import { addValueOrReplace, addExpressionOrReplace } from 'services/app/calculation.app-service';

import { Event, ResultCalculatedEvent, EventType } from 'services/types';
import { ExpressionValue } from './types';

export class CalculationHistory {
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

  setExpressionAsCurrent(): void {
    if (this._events.length) {
      addExpressionOrReplace(this._events);
    }
  }

  setResultAsCurrent(): void {
    if (this._result !== null) {
      addValueOrReplace(this._result);
    }
  }
}

export class HistoryStore {
  @observable private _history: CalculationHistory[] = [];
  @observable private _answer: string | null = null;
  @observable private _lastCalculatedExpression: ExpressionValue[] | null = null;

  constructor() {
    this._initHandlers();
  }

  @computed
  get historyItems(): CalculationHistory[] {
    return this._history;
  }

  @computed
  get answer(): string | null {
    return this._answer;
  }

  @computed
  get lastCalculatedExpression(): ExpressionValue[] | null {
    return this._lastCalculatedExpression;
  }

  @computed
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

    handle(EventType.VALUE_CHANGED, this._handleClearCalculatedExpression);
    handle(EventType.MATH_OPERATION_ADDED, this._handleClearCalculatedExpression);
    handle(EventType.LEFT_PARENTHESES_ADDED, this._handleClearCalculatedExpression);
    handle(EventType.RIGHT_PARENTHESES_ADDED, this._handleClearCalculatedExpression);
    handle(EventType.PREFIX_MODIFIER_ADDED, this._handleClearCalculatedExpression);
    handle(EventType.POSTFIX_MODIFIER_ADDED, this._handleClearCalculatedExpression);
    handle(EventType.MATH_CONSTANT_ADDED, this._handleClearCalculatedExpression);
    handle(EventType.EXPONENT_ADDED, this._handleClearCalculatedExpression);
    handle(EventType.EXPONENT_VALUE_CHANGED, this._handleClearCalculatedExpression);
    handle(EventType.POWER_ADDED, this._handleClearCalculatedExpression);
  }

  @action
  private _handleResultCalculated = ({ expression, result, events }: ResultCalculatedEvent): void => {
    this._history.push(new CalculationHistory(expression, result, events));

    if (result) {
      this._answer = result;
    }
    this._lastCalculatedExpression = expression;
  };

  @action
  private _handleClearCalculatedExpression = (): void => {
    this._lastCalculatedExpression = null;
  };

  @action
  removeLastExpression(): void {
    this._lastCalculatedExpression = null;
  }
}

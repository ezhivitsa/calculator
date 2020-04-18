import {
  AddMathOperationCommand,
  AddModifierCommand,
  AddValueCommand,
  Event,
  EventType,
  ValueChangedEvent,
  OperationAddedEvent,
  ModifierAddedEvent,
  ResultCalculatedEvent,
} from './types';

import { ApplicationState } from './application.state';

import { actionsStore } from './actions';
import { presentationStore } from './presentation';

export class ApplicationService {
  private _events: Event[] = [];

  private _applicationState = new ApplicationState();

  private _apply(event: Event, shouldAdd = true): void {
    if (shouldAdd) {
      this._events.push(event);
    }

    switch (event.type) {
      case EventType.VALUE_CHANGED:
        this._applicationState.handleValueChanged(event as ValueChangedEvent);
        actionsStore.handleValueChanged(event as ValueChangedEvent);
        presentationStore.handleValueChanged(event as ValueChangedEvent);
        break;

      case EventType.MATH_OPERATION_ADDED:
        this._applicationState.handleOperationAdded(event as OperationAddedEvent);
        actionsStore.handleOperationAdded(event as OperationAddedEvent);
        presentationStore.handleOperationAdded(event as OperationAddedEvent);
        break;

      case EventType.LEFT_PARENTHESES_ADDED:
        this._applicationState.handleLeftParenthesesAdded();
        actionsStore.handleLeftParenthesesAdded();
        presentationStore.handleLeftParenthesesAdded();
        break;

      case EventType.RIGHT_PARENTHESES_ADDED:
        this._applicationState.handleRightParenthesesAdded();
        actionsStore.handleRightParenthesesAdded();
        presentationStore.handleRightParenthesesAdded();
        break;

      case EventType.MODIFIER_ADDED:
        this._applicationState.handleModifierAdded(event as ModifierAddedEvent);
        actionsStore.handleModifierAdded(event as ModifierAddedEvent);
        presentationStore.handleModifierAdded(event as ModifierAddedEvent);
        break;

      case EventType.RESULT_CALCULATED:
        presentationStore.handleResultCalculated(event as ResultCalculatedEvent);
        break;
    }
  }

  private _dispose(): void {
    this._applicationState.dispose();
    actionsStore.dispose();
    presentationStore.dispose();
  }

  private _restore(): void {
    for (const event of this._events) {
      this._apply(event, false);
    }
  }

  handleSetValue(command: AddValueCommand): void {
    const newValue = this._applicationState.newValue(command.value);
    if (!newValue) {
      return;
    }

    this._apply({
      type: EventType.VALUE_CHANGED,
      addedValue: command.value,
      value: newValue,
    });
  }

  handleAddOperation(command: AddMathOperationCommand): void {
    if (this._applicationState.canAddSign(command.operation)) {
      this._apply({
        type: EventType.VALUE_CHANGED,
        addedValue: '-',
        value: '-',
      });
      return;
    }

    if (this._applicationState.canAddOperation()) {
      this._apply({
        type: EventType.MATH_OPERATION_ADDED,
        operation: command.operation,
      });
    }
  }

  handleAddLeftParentheses(): void {
    this._apply({
      type: EventType.LEFT_PARENTHESES_ADDED,
    });
  }

  handleAddRightParentheses(): void {
    if (!this._applicationState.canAddRightParentheses()) {
      return;
    }

    this._apply({
      type: EventType.RIGHT_PARENTHESES_ADDED,
    });
  }

  handleRemoveSymbol(): void {
    if (!this._events.length) {
      return;
    }

    this._events.pop();

    this._dispose();
    this._restore();
  }

  handleRemoveAllSymbols(): void {
    this._dispose();
  }

  handleAddModifier(command: AddModifierCommand): void {
    this._apply({
      type: EventType.MODIFIER_ADDED,
      modifier: command.modifier,
    });
  }

  async handleCalculateResult(): Promise<void> {
    const result = await actionsStore.calculateResult();
    this._apply({
      type: EventType.RESULT_CALCULATED,
      result,
    });
  }
}

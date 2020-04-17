import {
  AddMathOperationCommand,
  AddModifierCommand,
  AddValueCommand,
  Event,
  EventType,
  ValueChangedEvent,
  OperationAddedEvent,
} from './types';

import { ApplicationState } from './application.state';

import { actionsStore } from './actions';
import { presentationStore } from './presentation';

export class ApplicationService {
  private _events: Event[] = [];

  private _applicationState = new ApplicationState();

  private _apply(event: Event): void {
    this._events.push(event);

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
        addedValue: command.operation,
        value: command.operation,
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

  handleAddRightParentheses(): void {}

  handleAddModifier(command: AddModifierCommand): void {}
}

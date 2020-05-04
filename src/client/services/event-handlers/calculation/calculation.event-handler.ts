import { handle } from 'services/event-bus';

import {
  EventType,
  MathConstantAddedEvent,
  OperationAddedEvent,
  ModifierAddedEvent,
  ResultCalculatedEvent,
  ValueChangedEvent,
  MeasurementChangedEvent,
} from 'services/types';

import {
  addLeftParentheses,
  addRightParentheses,
  addOperation,
  setValue,
  clean,
  addConstant,
  addModifier,
  setMeasurement,
} from './calculation.store';

handle(EventType.INITIALIZED, (): void => {
  clean();
});

handle(EventType.LEFT_PARENTHESES_ADDED, (): void => {
  addLeftParentheses();
});

handle(EventType.RIGHT_PARENTHESES_ADDED, (): void => {
  addRightParentheses();
});

handle(EventType.MATH_CONSTANT_ADDED, (event: MathConstantAddedEvent): void => {
  addConstant(event.value || event.constant);
});

handle(EventType.MATH_OPERATION_ADDED, ({ operation }: OperationAddedEvent): void => {
  addOperation(operation);
});

handle(EventType.MODIFIER_ADDED, (event: ModifierAddedEvent): void => {
  addModifier(event.modifier);
});

// handle(EventType.RESULT_CALCULATED, (event: ResultCalculatedEvent): void => {});

handle(EventType.VALUE_CHANGED, ({ value }: ValueChangedEvent): void => {
  setValue(value);
});

handle(EventType.MEASUREMENT_CHANGED, ({ measurement }: MeasurementChangedEvent): void => {
  setMeasurement(measurement);
});

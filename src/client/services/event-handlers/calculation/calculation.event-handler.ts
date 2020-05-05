import { handle } from 'services/event-bus';

import {
  EventType,
  MathConstantAddedEvent,
  OperationAddedEvent,
  PrefixModifierAddedEvent,
  ResultCalculatedEvent,
  ValueChangedEvent,
  MeasurementChangedEvent,
  PostfixModifierAddedEvent,
} from 'services/types';

import {
  addLeftParentheses,
  addRightParentheses,
  addOperation,
  setValue,
  clean,
  addConstant,
  addPrefixModifier,
  setMeasurement,
  addPostfixModifier,
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

handle(EventType.PREFIX_MODIFIER_ADDED, ({ modifier }: PrefixModifierAddedEvent): void => {
  addPrefixModifier(modifier);
});

handle(EventType.POSTFIX_MODIFIER_ADDED, ({ modifier }: PostfixModifierAddedEvent): void => {
  addPostfixModifier(modifier);
});

// handle(EventType.RESULT_CALCULATED, (event: ResultCalculatedEvent): void => {});

handle(EventType.VALUE_CHANGED, ({ value }: ValueChangedEvent): void => {
  setValue(value);
});

handle(EventType.MEASUREMENT_CHANGED, ({ measurement }: MeasurementChangedEvent): void => {
  setMeasurement(measurement);
});

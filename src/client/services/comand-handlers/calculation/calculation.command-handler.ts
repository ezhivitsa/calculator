import { MathConstant, MathOperation } from 'stores/types';
import {
  AddMathOperationCommand,
  AddPrefixModifierCommand,
  AddConstantCommand,
  EventType,
  CommandType,
  CommandTypeMapping,
  CalculateResultCommand,
  SetMeasurementCommand,
  AddPostfixModifierCommand,
} from 'services/types';

import { handle } from 'services/command-bus';
import { apply } from 'services/event-bus';
import { getEvents } from 'services/event-store';

import {
  isCurrentExponent,
  isCurrentConstant,
  isOperationSign,
  getExponentValue,
  getValue,
  shouldRemoveLast,
  canAddOperation,
  canAddRightParentheses,
  canAddExponent,
  canAddPower,
} from './calculation.state';

import { restore } from 'services/event-bus';
import { removeLastEvent, removeAllEvents } from 'services/event-store';

import { historyStory } from 'stores/history';

handle(CommandType.INIT, (): void => {
  apply({
    type: EventType.INITIALIZED,
  });
});

handle(CommandType.ADD_VALUE, (command: CommandTypeMapping[CommandType.ADD_VALUE]): void => {
  if (isCurrentExponent()) {
    const value = getExponentValue(command.value);
    if (value === null) {
      return;
    }

    apply({
      type: EventType.EXPONENT_VALUE_CHANGED,
      addedValue: command.value,
      value,
    });
    return;
  }

  const value = getValue(command.value);
  if (value === null) {
    return;
  }

  if (isCurrentConstant()) {
    apply({
      type: EventType.MATH_OPERATION_ADDED,
      operation: MathOperation.Multiply,
    });
    apply({
      type: EventType.VALUE_CHANGED,
      addedValue: command.value,
      value,
    });
    return;
  }

  apply({
    type: EventType.VALUE_CHANGED,
    addedValue: command.value,
    value,
  });
});

handle(CommandType.ADD_MATH_OPERATION, (command: AddMathOperationCommand): void => {
  if (isOperationSign(command.operation)) {
    // ToDo: use constant
    apply({
      type: EventType.VALUE_CHANGED,
      addedValue: '-',
      value: '-',
    });
    return;
  }

  if (shouldRemoveLast()) {
    removeLastEvent();
    restore();
  }

  if (canAddOperation()) {
    apply({
      type: EventType.MATH_OPERATION_ADDED,
      operation: command.operation,
    });
  }

  // ToDo: add logic when we add command as first element in expression
});

handle(CommandType.ADD_LEFT_PARENTHESES, (): void => {
  apply({
    type: EventType.LEFT_PARENTHESES_ADDED,
  });
});

handle(CommandType.ADD_RIGHT_PARENTHESES, (): void => {
  if (canAddRightParentheses()) {
    apply({
      type: EventType.RIGHT_PARENTHESES_ADDED,
    });
  }
});

handle(CommandType.REMOVE_SYMBOL, (): void => {
  removeLastEvent();
  restore();
});

handle(CommandType.REMOVE_ALL_SYMBOLS, (): void => {
  removeAllEvents();
  restore();
});

handle(CommandType.ADD_PREFIX_MODIFIER, (command: AddPrefixModifierCommand): void => {
  apply({
    type: EventType.PREFIX_MODIFIER_ADDED,
    modifier: command.modifier,
  });
});

handle(CommandType.ADD_POSTFIX_MODIFIER, (command: AddPostfixModifierCommand): void => {
  apply({
    type: EventType.POSTFIX_MODIFIER_ADDED,
    modifier: command.modifier,
  });
});

handle(CommandType.ADD_MATH_CONSTANT, (command: AddConstantCommand): void => {
  if (isCurrentConstant()) {
    apply({
      type: EventType.MATH_OPERATION_ADDED,
      operation: MathOperation.Multiply,
    });
  }

  if (command.constant === MathConstant.RANDOM) {
    const value = Math.random().toString();

    apply({
      type: EventType.MATH_CONSTANT_ADDED,
      constant: MathConstant.RANDOM,
      value,
    });
    return;
  }

  if (command.constant === MathConstant.ANSWER) {
    const value = historyStory.lastNumericResult;

    if (value) {
      apply({
        type: EventType.MATH_CONSTANT_ADDED,
        constant: MathConstant.ANSWER,
        value,
      });
    }
    return;
  }

  apply({
    type: EventType.MATH_CONSTANT_ADDED,
    constant: command.constant,
  });
});

handle(CommandType.CALCULATE_RESULT, (command: CalculateResultCommand): void => {
  apply({
    type: EventType.RESULT_CALCULATED,
    result: command.result,
    expression: command.expression,
    events: getEvents(),
  });
});

handle(CommandType.SET_MEASUREMENT, (command: SetMeasurementCommand): void => {
  apply({
    type: EventType.MEASUREMENT_CHANGED,
    measurement: command.measurement,
  });
});

handle(CommandType.ADD_EXPONENT, (): void => {
  if (canAddExponent()) {
    apply({
      type: EventType.EXPONENT_ADDED,
    });
  }
});

handle(CommandType.ADD_POWER, (): void => {
  if (canAddPower()) {
    apply({
      type: EventType.POWER_ADDED,
    });
  }
});

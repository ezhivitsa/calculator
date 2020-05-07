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
  shouldAddMultiplyForConstant,
  isValueNumber,
  newValue,
  canAddSign,
  canAddOperation,
  canAddRightParentheses,
  isCurrentNumber,
  newExponentValue,
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
  const exponentValue = newExponentValue(command.value);
  if (exponentValue !== null) {
    apply({
      type: EventType.EXPONENT_VALUE_CHANGED,
      addedValue: command.value,
      value: exponentValue,
    });
    return;
  }

  if (shouldAddMultiplyForConstant()) {
    if (!isValueNumber(command.value)) {
      return;
    }
    apply({
      type: EventType.MATH_OPERATION_ADDED,
      operation: MathOperation.Multiply,
    });
    apply({
      type: EventType.VALUE_CHANGED,
      addedValue: command.value,
      value: command.value,
    });
    return;
  }

  const resultValue = newValue(command.value);
  if (!resultValue) {
    return;
  }
  apply({
    type: EventType.VALUE_CHANGED,
    addedValue: command.value,
    value: resultValue,
  });
});

handle(CommandType.ADD_MATH_OPERATION, (command: AddMathOperationCommand): void => {
  if (canAddSign(command.operation)) {
    apply({
      type: EventType.VALUE_CHANGED,
      addedValue: '-',
      value: '-',
    });
    return;
  }

  if (canAddOperation()) {
    apply({
      type: EventType.MATH_OPERATION_ADDED,
      operation: command.operation,
    });
  }
});

handle(CommandType.ADD_LEFT_PARENTHESES, (): void => {
  apply({
    type: EventType.LEFT_PARENTHESES_ADDED,
  });
});

handle(CommandType.ADD_RIGHT_PARENTHESES, (): void => {
  if (!canAddRightParentheses()) {
    return;
  }

  apply({
    type: EventType.RIGHT_PARENTHESES_ADDED,
  });
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
  if (shouldAddMultiplyForConstant()) {
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
  if (!isCurrentNumber()) {
    return;
  }

  apply({
    type: EventType.EXPONENT_ADDED,
  });
});

import { MathConstant, MathOperation } from 'stores/types';
import {
  AddMathOperationCommand,
  AddPrefixModifierCommand,
  AddConstantCommand,
  EventType,
  CommandType,
  AddValueCommand,
  CalculateResultCommand,
  SetMeasurementCommand,
  AddPostfixModifierCommand,
  AddPowerForConstantCommand,
  AddPowerForValueCommand,
  AddValuePowerCommand,
  AddValueOrReplaceCommand,
  AddExpressionOrReplaceCommand,
} from 'services/types';

import { handle } from 'services/command-bus';
import { apply, restore } from 'services/event-bus';
import { getDataEvents, removeLastEvent, removeAllEvents } from 'services/event-store';

import {
  isCurrentExponent,
  isCurrentConstant,
  isOperationSign,
  getExponentValue,
  getValue,
  getResult,
  shouldRemoveLast,
  shouldChangeLevel,
  canAddOperation,
  canAddRightParentheses,
  canAddExponent,
  canAddPower,
  canAddValue,
  shouldAddMultiplyBeforeValue,
} from './calculation.state';

function setLastAnswer(): void {
  const result = getResult();
  if (result) {
    removeAllEvents();
    restore();

    apply({
      type: EventType.VALUE_CHANGED,
      value: result,
      addedValue: result,
    });
  }
}

function removeAllEventsIfLastResult(): void {
  const result = getResult();
  if (result) {
    removeAllEvents();
    restore();
  }
}

function addMathConstant(constant: MathConstant, constantValue: string | null = null): void {
  while (shouldChangeLevel()) {
    apply({
      type: EventType.POWER_FINISHED,
    });
  }

  if (isCurrentConstant()) {
    apply({
      type: EventType.MATH_OPERATION_ADDED,
      operation: MathOperation.Multiply,
    });
  }

  if (constant === MathConstant.Random) {
    const value = Math.random().toString();

    apply({
      type: EventType.MATH_CONSTANT_ADDED,
      constant: MathConstant.Random,
      value,
    });
    return;
  }

  if (constant === MathConstant.Answer) {
    const value = constantValue;

    if (value) {
      apply({
        type: EventType.MATH_CONSTANT_ADDED,
        constant: MathConstant.Answer,
        value,
      });
    }
    return;
  }

  apply({
    type: EventType.MATH_CONSTANT_ADDED,
    constant,
  });
}

handle(CommandType.INIT, (): void => {
  apply({
    type: EventType.INITIALIZED,
  });
});

handle(CommandType.ADD_VALUE, (command: AddValueCommand): void => {
  removeAllEventsIfLastResult();

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
  setLastAnswer();

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

  while (shouldChangeLevel()) {
    apply({
      type: EventType.POWER_FINISHED,
    });
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
  removeAllEventsIfLastResult();

  apply({
    type: EventType.LEFT_PARENTHESES_ADDED,
  });
});

handle(CommandType.ADD_RIGHT_PARENTHESES, (): void => {
  if (shouldChangeLevel()) {
    apply({
      type: EventType.POWER_FINISHED,
    });
  }

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
  removeAllEventsIfLastResult();

  apply({
    type: EventType.PREFIX_MODIFIER_ADDED,
    modifier: command.modifier,
  });
});

handle(CommandType.ADD_POSTFIX_MODIFIER, (command: AddPostfixModifierCommand): void => {
  setLastAnswer();

  apply({
    type: EventType.POSTFIX_MODIFIER_ADDED,
    modifier: command.modifier,
  });
});

handle(CommandType.ADD_MATH_CONSTANT, (command: AddConstantCommand): void => {
  removeAllEventsIfLastResult();
  addMathConstant(command.constant, command.value);
});

handle(CommandType.CALCULATE_RESULT, (command: CalculateResultCommand): void => {
  const events = getDataEvents();

  removeAllEvents();
  restore();

  apply({
    type: EventType.RESULT_CALCULATED,
    result: command.result,
    expression: command.expression,
    events,
  });
});

handle(CommandType.SET_MEASUREMENT, (command: SetMeasurementCommand): void => {
  apply({
    type: EventType.MEASUREMENT_CHANGED,
    measurement: command.measurement,
  });
});

handle(CommandType.ADD_EXPONENT, (): void => {
  setLastAnswer();

  if (canAddExponent()) {
    apply({
      type: EventType.EXPONENT_ADDED,
    });
  }
});

handle(CommandType.ADD_POWER, (): void => {
  setLastAnswer();

  if (canAddPower()) {
    apply({
      type: EventType.POWER_ADDED,
    });
  }
});

handle(CommandType.ADD_POWER_FOR_CONSTANT, (command: AddPowerForConstantCommand): void => {
  removeAllEventsIfLastResult();

  addMathConstant(command.constant);
  apply({
    type: EventType.POWER_ADDED,
  });
});

handle(CommandType.ADD_POWER_FOR_VALUE, (command: AddPowerForValueCommand): void => {
  removeAllEventsIfLastResult();

  if (shouldAddMultiplyBeforeValue()) {
    apply({
      type: EventType.MATH_OPERATION_ADDED,
      operation: MathOperation.Multiply,
    });
  }

  for (let i = 0; i < command.value.length; i += 1) {
    apply({
      type: EventType.VALUE_CHANGED,
      addedValue: command.value[i],
      value: command.value.slice(0, i + 1),
    });
  }

  apply({
    type: EventType.POWER_ADDED,
  });
});

handle(CommandType.ADD_VALUE_POWER, (command: AddValuePowerCommand): void => {
  setLastAnswer();

  if (!canAddPower()) {
    return;
  }

  apply({
    type: EventType.POWER_ADDED,
  });

  for (let i = 0; i < command.value.length; i += 1) {
    apply({
      type: EventType.VALUE_CHANGED,
      addedValue: command.value[i],
      value: command.value.slice(0, i + 1),
    });
  }
});

handle(CommandType.ADD_ROOT, (): void => {
  setLastAnswer();

  if (canAddPower()) {
    apply({
      type: EventType.ROOT_ADDED,
    });
  }
});

handle(CommandType.ADD_VALUE_OR_REPLACE, (command: AddValueOrReplaceCommand): void => {
  if (!canAddValue()) {
    removeAllEvents();
    restore();
  }

  apply({
    type: EventType.VALUE_CHANGED,
    value: command.value,
    addedValue: command.value,
  });
});

handle(CommandType.ADD_EXPRESSION_OR_REPLACE, (command: AddExpressionOrReplaceCommand): void => {
  if (!canAddValue()) {
    removeAllEvents();
    restore();
  }

  for (const event of command.events) {
    apply({ ...event });
  }
});

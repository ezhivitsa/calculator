import { isNumber } from 'lib/numbers';

import { NumberValue, MathOperation } from 'stores/types';
import { ValueChangedEvent, OperationAddedEvent, ModifierAddedEvent, EventType } from 'services/types';
import { PREFIX_MODIFIERS } from 'stores/constants';

import { handle } from 'services/event-bus';

const START_VALUE = '0';

interface Current {
  value: string;
  hasMinusSign: boolean;
  action: MathOperation | null;
  isValueConstant: boolean;
}

interface StateData {
  current: Current;
  hasValues: boolean;
  numOpenedParentheses: number;
}

const initialCurrent: Current = {
  value: '',
  hasMinusSign: false,
  action: null,
  isValueConstant: false,
};

const stateData: StateData = {
  current: {
    ...initialCurrent,
  },
  hasValues: false,
  numOpenedParentheses: 0,
};

handle(EventType.INITIALIZED, () => {
  stateData.hasValues = false;
  stateData.numOpenedParentheses = 0;
  stateData.current = {
    ...initialCurrent,
  };
});

handle(EventType.VALUE_CHANGED, (event: ValueChangedEvent): void => {
  stateData.current.value = event.value;
});

handle(EventType.MATH_OPERATION_ADDED, (event: OperationAddedEvent): void => {
  stateData.hasValues = true;

  stateData.current = {
    ...initialCurrent,
    action: event.operation,
  };
});

handle(EventType.LEFT_PARENTHESES_ADDED, (): void => {
  stateData.numOpenedParentheses += 1;
  stateData.hasValues = true;
  stateData.current = {
    ...initialCurrent,
  };
});

handle(EventType.RIGHT_PARENTHESES_ADDED, (): void => {
  stateData.numOpenedParentheses -= 1;
});

handle(EventType.MODIFIER_ADDED, (event: ModifierAddedEvent): void => {
  stateData.hasValues = true;
  stateData.current = {
    ...initialCurrent,
  };

  if (PREFIX_MODIFIERS.includes(event.modifier)) {
    stateData.numOpenedParentheses += 1;
  }
});

handle(EventType.MATH_CONSTANT_ADDED, (): void => {
  stateData.current.isValueConstant = true;
});

export function newValue(value: string): string | null {
  const newValue =
    !stateData.hasValues && !stateData.current.value && value === NumberValue.DOT
      ? `${START_VALUE}.`
      : `${stateData.current.value}${value}`;

  if (!isNumber(newValue)) {
    return null;
  }

  return newValue;
}

export function canAddSign(operation: MathOperation): boolean {
  if (operation !== MathOperation.Minus || stateData.current.hasMinusSign) {
    return false;
  }

  if (!stateData.current.value) {
    return true;
  }

  return false;
}

export function canAddOperation(): boolean {
  return isNumber(stateData.current.value) || stateData.current.isValueConstant;
}

export function canAddRightParentheses(): boolean {
  return (
    stateData.numOpenedParentheses > 0 &&
    (stateData.current.action === null || (stateData.current.action !== null && isNumber(stateData.current.value)))
  );
}

export function shouldAddMultiplyForConstant(): boolean {
  return stateData.current.isValueConstant;
}

export function isValueNumber(value: string): boolean {
  return isNumber(value);
}

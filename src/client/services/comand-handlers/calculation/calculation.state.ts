import { isNumber } from 'lib/numbers';

import { ValueChangedEvent, NumberValue, MathAction, OperationAddedEvent, ModifierAddedEvent } from 'stores/types';
import { PREFIX_MODIFIERS } from 'stores/constants';

const START_VALUE = '0';

interface Current {
  value: string;
  hasMinusSign: boolean;
  action: MathAction | null;
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

export function handleValueChanged(event: ValueChangedEvent): void {
  stateData.current.value = event.value;
}

export function handleOperationAdded(event: OperationAddedEvent): void {
  stateData.hasValues = true;

  stateData.current = {
    ...initialCurrent,
    action: event.operation,
  };
}

export function handleLeftParenthesesAdded(): void {
  stateData.numOpenedParentheses += 1;
  stateData.hasValues = true;
  stateData.current = {
    ...initialCurrent,
  };
}

export function handleRightParenthesesAdded(): void {
  stateData.numOpenedParentheses -= 1;
}

export function handleModifierAdded(event: ModifierAddedEvent): void {
  stateData.hasValues = true;
  stateData.current = {
    ...initialCurrent,
  };

  if (PREFIX_MODIFIERS.includes(event.modifier)) {
    stateData.numOpenedParentheses += 1;
  }
}

export function handleMathConstantAdded(): void {
  stateData.current.isValueConstant = true;
}

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

export function canAddSign(operation: MathAction): boolean {
  if (operation !== MathAction.MINUS || stateData.current.hasMinusSign) {
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

export function dispose(): void {
  stateData.hasValues = false;
  stateData.numOpenedParentheses = 0;
  stateData.current = {
    ...initialCurrent,
  };
}

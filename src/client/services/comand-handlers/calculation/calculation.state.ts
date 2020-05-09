import { isNumber, isNaturalNumber, isRealNumber } from 'lib/numbers';

import { MathOperation } from 'stores/types';
import { ValueChangedEvent, OperationAddedEvent, EventType, ExponentValueChangedEvent } from 'services/types';

import { handle } from 'services/event-bus';

const START_VALUE = '0';
const SIGN = '-';

const PRIORITY_OPERATIONS = [MathOperation.Divide, MathOperation.Multiply];

// interface Current {
//   value: string;
//   hasMinusSign: boolean;
//   action: MathOperation | null;
//   isValueConstant: boolean;
//   isExponentValue: boolean;
//   exponentValue: string;
// }

enum ExpressionItem {
  VALUE,
  CONSTANT_VALUE,
  EXPONENT,
  VALUE_SIGN,
  PRIORITY_MATH_OPERATION,
  NON_PRIORITY_MATH_OPERATION,
  PREFIX_MODIFIER,
  POSTFIX_MODIFIER,
  LEFT_PARENTHESES,
  RIGHT_PARENTHESES,
}

interface Level {
  // current: Current;
  expression: ExpressionItem[];
  currentValue: string;
}

interface StateData {
  levels: Level[];
  // hasValues: boolean;
}

// const initialCurrent: Current = {
//   value: '',
//   hasMinusSign: false,
//   action: null,
//   isValueConstant: false,
//   isExponentValue: false,
//   exponentValue: '',
// };

const stateData: StateData = {
  levels: [
    {
      expression: [],
      currentValue: '',
    },
  ],
};

function getLastLevel(): Level {
  return stateData.levels[stateData.levels.length - 1];
}

function getLastExpressionItem(): ExpressionItem | null {
  const level = getLastLevel();
  if (!level.expression.length) {
    return null;
  }

  return level.expression[level.expression.length - 1];
}

function getLastTwoExpressionItems(): [ExpressionItem?, ExpressionItem?] {
  const level = getLastLevel();
  if (!level.expression.length) {
    return [];
  }

  return [level.expression[level.expression.length - 2], level.expression[level.expression.length - 1]];
}

function openedParenthesesOnLevel(level: Level): number {
  return level.expression.reduce((res: number, item: ExpressionItem): number => {
    if (item === ExpressionItem.LEFT_PARENTHESES) {
      return res + 1;
    }

    if (item === ExpressionItem.RIGHT_PARENTHESES) {
      return res - 1;
    }

    return res;
  }, 0);
}

function changeLevelIfRequired(): void {
  if (stateData.levels.length === 1) {
    return;
  }

  const level = getLastLevel();
  const numOpenedParentheses = openedParenthesesOnLevel(level);
  if (numOpenedParentheses === 0) {
    stateData.levels.pop();
  }
}

function addToLevel(item: ExpressionItem): void {
  const level = getLastLevel();
  level.expression.push(item);

  if (item !== ExpressionItem.VALUE && item !== ExpressionItem.VALUE_SIGN) {
    level.currentValue = '';
  }
}

function addLevel(): void {
  stateData.levels.push({
    expression: [],
    currentValue: '',
  });
}

handle(EventType.INITIALIZED, () => {
  stateData.levels = [
    {
      expression: [],
      currentValue: '',
    },
  ];
});

handle(EventType.VALUE_CHANGED, ({ value }: ValueChangedEvent): void => {
  const level = getLastLevel();
  level.currentValue = value;

  if (value === SIGN) {
    level.expression.push(ExpressionItem.VALUE_SIGN);
    return;
  }

  const expressionItem = getLastExpressionItem();
  if (expressionItem !== ExpressionItem.VALUE) {
    level.expression.push(ExpressionItem.VALUE);
  }
});

handle(EventType.MATH_OPERATION_ADDED, ({ operation }: OperationAddedEvent): void => {
  changeLevelIfRequired();

  addToLevel(
    PRIORITY_OPERATIONS.includes(operation)
      ? ExpressionItem.PRIORITY_MATH_OPERATION
      : ExpressionItem.NON_PRIORITY_MATH_OPERATION,
  );
});

handle(EventType.LEFT_PARENTHESES_ADDED, (): void => {
  const level = getLastLevel();
  if (level.expression.length) {
    changeLevelIfRequired();
  }

  addToLevel(ExpressionItem.LEFT_PARENTHESES);
});

handle(EventType.RIGHT_PARENTHESES_ADDED, (): void => {
  addToLevel(ExpressionItem.RIGHT_PARENTHESES);
});

handle(EventType.PREFIX_MODIFIER_ADDED, (): void => {
  addToLevel(ExpressionItem.PREFIX_MODIFIER);
  addToLevel(ExpressionItem.LEFT_PARENTHESES);
});

handle(EventType.MATH_CONSTANT_ADDED, (): void => {
  addToLevel(ExpressionItem.CONSTANT_VALUE);
});

handle(EventType.EXPONENT_ADDED, (): void => {
  addToLevel(ExpressionItem.EXPONENT);
});

handle(EventType.EXPONENT_VALUE_CHANGED, ({ value }: ExponentValueChangedEvent): void => {
  const level = getLastLevel();
  level.currentValue = value;

  const expressionItem = getLastExpressionItem();
  if (expressionItem !== ExpressionItem.VALUE) {
    level.expression.push(ExpressionItem.VALUE);
  }
});

handle(EventType.POWER_ADDED, (): void => {
  addLevel();
});

export function isCurrentExponent(): boolean {
  const [beforeLast, last] = getLastTwoExpressionItems();
  return last === ExpressionItem.EXPONENT || (last === ExpressionItem.VALUE && beforeLast === ExpressionItem.EXPONENT);
}

export function isCurrentConstant(): boolean {
  const item = getLastExpressionItem();
  return item === ExpressionItem.CONSTANT_VALUE;
}

export function isOperationSign(operation: MathOperation): boolean {
  if (operation !== MathOperation.Minus) {
    return false;
  }

  const item = getLastExpressionItem();
  return (
    !item ||
    item === ExpressionItem.PRIORITY_MATH_OPERATION ||
    item === ExpressionItem.LEFT_PARENTHESES ||
    item === ExpressionItem.EXPONENT
  );
}

export function shouldRemoveLast(): boolean {
  const item = getLastExpressionItem();
  return (
    item === ExpressionItem.PRIORITY_MATH_OPERATION ||
    item === ExpressionItem.NON_PRIORITY_MATH_OPERATION ||
    (stateData.levels.length > 1 && item === null)
  );
}

export function canAddOperation(): boolean {
  const item = getLastExpressionItem();
  return item !== ExpressionItem.LEFT_PARENTHESES;
}

export function canAddRightParentheses(): boolean {
  const level = getLastLevel();
  const openedParentheses = openedParenthesesOnLevel(level);

  if (openedParentheses === 0) {
    return false;
  }

  const item = getLastExpressionItem();

  return !(
    item === ExpressionItem.LEFT_PARENTHESES ||
    item === ExpressionItem.EXPONENT ||
    item === ExpressionItem.PRIORITY_MATH_OPERATION ||
    item === ExpressionItem.NON_PRIORITY_MATH_OPERATION ||
    item === ExpressionItem.VALUE_SIGN
  );
}

export function canAddExponent(): boolean {
  const level = getLastLevel();
  return isRealNumber(level.currentValue);
}

export function canAddPower(): boolean {
  const level = getLastLevel();
  const item = getLastExpressionItem();

  return isRealNumber(level.currentValue) || item === ExpressionItem.CONSTANT_VALUE;
}

export function getExponentValue(value: string): string | null {
  const level = getLastLevel();
  const resultValue = level.currentValue + value;

  if (isNaturalNumber(resultValue)) {
    return resultValue;
  }

  return null;
}

export function getValue(value: string): string | null {
  const level = getLastLevel();
  const resultValue = level.currentValue + value;

  if (isNumber(resultValue)) {
    return resultValue;
  }

  return null;
}

// export function newValue(value: string): string | null {
//   const level = getLastLevel();

//   const newValue =
//     !stateData.hasValues && !level.current.value && value === NumberValue.DOT
//       ? `${START_VALUE}.`
//       : `${level.current.value}${value}`;

//   if (!isNumber(newValue)) {
//     return null;
//   }

//   return newValue;
// }

// export function canAddSign(operation: MathOperation): boolean {
//   const level = getLastLevel();

//   if (operation !== MathOperation.Minus || level.current.hasMinusSign) {
//     return false;
//   }

//   if (!level.current.value) {
//     return true;
//   }

//   return false;
// }

// export function canAddOperation(): boolean {
//   const level = getLastLevel();

//   return isNumber(level.current.value) || level.current.isValueConstant;
// }

// export function canAddRightParentheses(): boolean {
//   const {
//     numOpenedParentheses,
//     current: { action, value },
//   } = getLastLevel();

//   return numOpenedParentheses > 0 && (action === null || (action !== null && isNumber(value)));
// }

// export function isCurrentConstant(): boolean {
//   return getLastLevel().current.isValueConstant;
// }

// export function isValueNumber(value: string): boolean {
//   return isNumber(value);
// }

// export function isCurrentNumber(): boolean {
//   const { value, action, isValueConstant } = getLastLevel().current;

//   return isNumber(value) && action === null && !isValueConstant;
// }

// export function newExponentValue(value: string): string | null {
//   const level = getLastLevel();

//   if (!level.current.isExponentValue) {
//     return null;
//   }

//   const newValue = level.current.exponentValue + value;
//   return isNaturalNumber(newValue) ? newValue : null;
// }

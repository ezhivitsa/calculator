import { isNumber, isNaturalNumber, isRealNumber } from 'lib/numbers';

import { MathOperation } from 'stores/types';
import {
  ValueChangedEvent,
  OperationAddedEvent,
  EventType,
  ExponentValueChangedEvent,
  ResultCalculatedEvent,
} from 'services/types';

import { handle } from 'services/event-bus';

import { MINUS_SIGN } from 'constants/app';

const PRIORITY_OPERATIONS = [MathOperation.Divide, MathOperation.Multiply];

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
  RESULT,
}

interface Level {
  expression: ExpressionItem[];
  currentValue: string;
}

interface StateData {
  levels: Level[];
}

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

  if (value === MINUS_SIGN) {
    level.expression.push(ExpressionItem.VALUE_SIGN);
    return;
  }

  const expressionItem = getLastExpressionItem();
  if (expressionItem !== ExpressionItem.VALUE) {
    level.expression.push(ExpressionItem.VALUE);
  }
});

handle(EventType.MATH_OPERATION_ADDED, ({ operation }: OperationAddedEvent): void => {
  addToLevel(
    PRIORITY_OPERATIONS.includes(operation)
      ? ExpressionItem.PRIORITY_MATH_OPERATION
      : ExpressionItem.NON_PRIORITY_MATH_OPERATION,
  );
});

handle(EventType.LEFT_PARENTHESES_ADDED, (): void => {
  addToLevel(ExpressionItem.LEFT_PARENTHESES);
});

handle(EventType.RIGHT_PARENTHESES_ADDED, (): void => {
  addToLevel(ExpressionItem.RIGHT_PARENTHESES);
});

handle(EventType.POWER_FINISHED, (): void => {
  stateData.levels.pop();
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

handle(EventType.ROOT_ADDED, (): void => {
  addLevel();
});

handle(EventType.RESULT_CALCULATED, ({ result }: ResultCalculatedEvent): void => {
  const level = getLastLevel();

  if (result) {
    addToLevel(ExpressionItem.RESULT);
    level.currentValue = result;
  }
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
    item === null ||
    item === ExpressionItem.PRIORITY_MATH_OPERATION ||
    item === ExpressionItem.LEFT_PARENTHESES ||
    item === ExpressionItem.EXPONENT
  );
}

export function isEmpty(): boolean {
  const item = getLastExpressionItem();
  return item === null && stateData.levels.length === 1;
}

export function shouldRemoveLast(): boolean {
  const item = getLastExpressionItem();
  return (
    item === ExpressionItem.PRIORITY_MATH_OPERATION ||
    item === ExpressionItem.NON_PRIORITY_MATH_OPERATION ||
    (stateData.levels.length > 1 && item === null)
  );
}

export function shouldChangeLevel(): boolean {
  if (stateData.levels.length === 1) {
    return false;
  }

  const level = getLastLevel();
  const numOpenedParentheses = openedParenthesesOnLevel(level);
  return numOpenedParentheses === 0 && level.expression.length > 0;
}

export function shouldAddMultiplyBeforeValue(): boolean {
  const item = getLastExpressionItem();
  return !(
    item === null ||
    item === ExpressionItem.PRIORITY_MATH_OPERATION ||
    item === ExpressionItem.NON_PRIORITY_MATH_OPERATION
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
  return isRealNumber(level.currentValue) || isNaturalNumber(level.currentValue);
}

export function canAddPower(): boolean {
  const level = getLastLevel();
  const item = getLastExpressionItem();

  return (
    isRealNumber(level.currentValue) ||
    isNaturalNumber(level.currentValue) ||
    item === ExpressionItem.CONSTANT_VALUE ||
    item === ExpressionItem.RIGHT_PARENTHESES ||
    item === ExpressionItem.POSTFIX_MODIFIER
  );
}

export function canAddValue(): boolean {
  const item = getLastExpressionItem();
  return (
    item === null ||
    item === ExpressionItem.PRIORITY_MATH_OPERATION ||
    item === ExpressionItem.NON_PRIORITY_MATH_OPERATION ||
    item === ExpressionItem.RIGHT_PARENTHESES
  );
}

export function canAddPostfixModifier(): boolean {
  const item = getLastExpressionItem();
  return item === ExpressionItem.VALUE || item === ExpressionItem.RIGHT_PARENTHESES;
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

export function getResult(): string | null {
  const item = getLastExpressionItem();
  if (item !== ExpressionItem.RESULT) {
    return null;
  }

  const level = getLastLevel();
  return level.currentValue;
}

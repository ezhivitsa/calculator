import { send } from 'services/command-bus';

import {
  MathOperation,
  Parentheses,
  NumberValue,
  MathConstant,
  PrefixModifier,
  ExpressionValue,
  MeasurementType,
  PostfixModifier,
} from 'stores/types';
import { CommandType, Command } from 'services/types';

import { validate, calculateResult as calculate } from 'services/event-handlers/calculation/calculation.store';

export function init(): void {
  send({
    type: CommandType.INIT,
  });
}

export function setNumber(value: NumberValue): void {
  send({
    type: CommandType.ADD_VALUE,
    value,
  });
}

export function addAction(action: MathOperation): void {
  send({
    type: CommandType.ADD_MATH_OPERATION,
    operation: action,
  });
}

export function addPrefixModifier(modifier: PrefixModifier): void {
  send({
    type: CommandType.ADD_PREFIX_MODIFIER,
    modifier,
  });
}

export function addPostfixModifier(modifier: PostfixModifier): void {
  send({
    type: CommandType.ADD_POSTFIX_MODIFIER,
    modifier,
  });
}

export function addConstant(constant: MathConstant): void {
  send({
    type: CommandType.ADD_MATH_CONSTANT,
    constant,
  });
}

export function cleanAll(): void {
  send({
    type: CommandType.REMOVE_ALL_SYMBOLS,
  });
}

export function clean(): void {
  send({
    type: CommandType.REMOVE_SYMBOL,
  });
}

export function addParentheses(parentheses: Parentheses): void {
  const command: Command =
    parentheses === Parentheses.LEFT
      ? {
          type: CommandType.ADD_LEFT_PARENTHESES,
        }
      : {
          type: CommandType.ADD_RIGHT_PARENTHESES,
        };
  send(command);
}

export async function calculateResult(expression: ExpressionValue[]): Promise<void> {
  const valid = await validate();
  if (!valid) {
    return;
  }

  const result = await calculate();

  send({
    type: CommandType.CALCULATE_RESULT,
    expression,
    result,
  });
}

export function setMeasurement(measurement: MeasurementType): void {
  send({
    type: CommandType.SET_MEASUREMENT,
    measurement,
  });
}

export function addExponent(): void {
  send({
    type: CommandType.ADD_EXPONENT,
  });
}

export function addPower(): void {
  send({
    type: CommandType.ADD_POWER,
  });
}

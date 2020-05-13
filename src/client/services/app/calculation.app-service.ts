import { send } from 'services/command-bus';

import {
  MathOperation,
  Parentheses,
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

export function setNumber(value: string): void {
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

export function addConstant(constant: MathConstant, value: string | null): void {
  send({
    type: CommandType.ADD_MATH_CONSTANT,
    constant,
    value,
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
    parentheses === Parentheses.Left
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

export function addPowerForConstant(constant: MathConstant): void {
  send({
    type: CommandType.ADD_POWER_FOR_CONSTANT,
    constant,
  });
}

export function addPowerForValue(value: string): void {
  send({
    type: CommandType.ADD_POWER_FOR_VALUE,
    value,
  });
}

export function addValuePower(value: string): void {
  send({
    type: CommandType.ADD_VALUE_POWER,
    value,
  });
}

export function addRoot(): void {
  send({
    type: CommandType.ADD_ROOT,
  });
}

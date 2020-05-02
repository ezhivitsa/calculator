import { send } from 'services/command-bus';

import { MathOperation, Parentheses, NumberValue, MathConstant, MathModifier, ExpressionValue } from 'stores/types';
import { CommandType, Command } from 'services/types';

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

export function addModifier(modifier: MathModifier): void {
  send({
    type: CommandType.ADD_MODIFIER,
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

export function calculateResult(expression: ExpressionValue[]): void {
  send({
    type: CommandType.CALCULATE_RESULT,
    expression,
  });
}

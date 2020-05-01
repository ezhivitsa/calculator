import { handle } from 'services/event-bus';

import {
  EventType,
  MathConstantAddedEvent,
  OperationAddedEvent,
  ModifierAddedEvent,
  ResultCalculatedEvent,
  ValueChangedEvent,
  MathAction,
} from 'stores/types';

import { expressionIsBinary, expressionIsSingle, hasOperation, setOperation } from './calculation.store';

function addActionForBinaryExpression(action: MathAction): void {
  const { left, operation, right } = currentExpression;

  if (operation === null) {
    currentExpression.operation = action;
    return;
  }

  if (PRIORITY_ACTIONS.includes(action)) {
    const expression: BinaryExpression = {
      left: right,
      operation: action,
      right: '',
      parent: this._expression,
    };
    currentExpression.right = expression;
    this._expression = expression;
  } else {
    currentExpression.left = {
      left,
      operation,
      right,
      parent: this._expression,
    };
    currentExpression.operation = action;
    currentExpression.right = '';
  }
}

handle(EventType.LEFT_PARENTHESES_ADDED, (): void => {});

handle(EventType.RIGHT_PARENTHESES_ADDED, (): void => {});

handle(EventType.MATH_CONSTANT_ADDED, (event: MathConstantAddedEvent): void => {});

handle(EventType.MATH_OPERATION_ADDED, ({ operation }: OperationAddedEvent): void => {
  if (expressionIsBinary()) {
    return addActionForBinaryExpression(operation);
  }

  if (expressionIsSingle()) {
    return addActionForSingleExpression(operation);
  }
});

handle(EventType.MODIFIER_ADDED, (event: ModifierAddedEvent): void => {});

handle(EventType.RESULT_CALCULATED, (event: ResultCalculatedEvent): void => {});

handle(EventType.VALUE_CHANGED, (event: ValueChangedEvent): void => {});

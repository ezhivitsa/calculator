import {
  ValueChangedEvent,
  OperationAddedEvent,
  MathAction,
  ModifierAddedEvent,
  MathModifier,
  MathConstantAddedEvent,
} from 'stores/types';

type Expression = BinaryExpression | SingleExpression;

type Value = string | Expression;

interface SingleExpression {
  value: Value;
  modifier: MathModifier;
  parent: Expression | null;
}

interface BinaryExpression {
  left: Value;
  operation: MathAction | null;
  right: Value;
  parent: Expression | null;
}

const rootExpression: BinaryExpression = {
  left: '',
  operation: null,
  right: '',
  parent: null,
};

const expression: Expression = rootExpression;

function instanceofBinaryExpression(object: Expression): object is BinaryExpression {
  return 'left' in object && 'right' in object;
}

function instanceofSingleExpression(object: Expression): object is SingleExpression {
  return 'value' in object;
}

export function expressionIsBinary(): boolean {
  return instanceofBinaryExpression(expression);
}

export function expressionIsSingle(): boolean {
  return instanceofSingleExpression(expression);
}

export function hasOperation(): boolean {}

export function setOperation(): void {}

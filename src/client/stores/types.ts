export enum MathAction {
  DIVIDE = '÷',
  MULTIPLY = '×',
  MINUS = '−',
  PLUS = '+',
}

export enum MathModifier {
  PERCENT = '%',
  FACTORIAL = 'factorial',
  SIN = 'sin',
  ASIN = 'asin',
  LN = 'ln',
  COS = 'cos',
  ACOS = 'acos',
  LOG = 'log',
  TAN = 'tan',
  ATAN = 'atan',
  SQUARE_ROOT = 'square-root',
  EXP = 'exp',
}

export enum NumberValue {
  ZERO = '0',
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  DOT = '.',
}

export enum Parentheses {
  LEFT = '(',
  RIGHT = ')',
}

export enum CleanAction {
  CLEAN_ONE = 'CE',
  CLEAN_RESULT = 'AC',
}

export enum MathConstant {
  PI = 'pi',
  E = 'e',
  ANSWER = 'Ans',
  RANDOM = 'Rnd',
}

export type ExpressionValue = {
  value: string;
  bold: boolean;
};

// Commands

export enum CommandType {
  ADD_VALUE = 'add-value',
  ADD_MATH_OPERATION = 'add-math-operation',
  ADD_LEFT_PARENTHESES = 'add-left-parentheses',
  ADD_RIGHT_PARENTHESES = 'add-right-parentheses',
  ADD_MODIFIER = 'add-modifier',
  REMOVE_SYMBOL = 'remove-symbol',
  REMOVE_ALL_SYMBOLS = 'remove-all-symbols',
  CALCULATE_RESULT = 'calculate-result',
  ADD_MATH_CONSTANT = 'add-math-constant',
}

export interface BaseCommand {
  type: CommandType;
}

export interface AddValueCommand extends BaseCommand {
  value: string;
}

export interface AddMathOperationCommand extends BaseCommand {
  operation: MathAction;
}

export interface AddModifierCommand extends BaseCommand {
  modifier: MathModifier;
}

export interface AddConstantCommand extends BaseCommand {
  constant: MathConstant;
}

export type Command = BaseCommand | AddValueCommand | AddMathOperationCommand | AddModifierCommand | AddConstantCommand;

export type CommandTypeMapping = {
  [CommandType.ADD_VALUE]: AddValueCommand;
  [CommandType.ADD_MATH_OPERATION]: AddMathOperationCommand;
  [CommandType.ADD_LEFT_PARENTHESES]: BaseCommand;
  [CommandType.ADD_RIGHT_PARENTHESES]: BaseCommand;
  [CommandType.ADD_MODIFIER]: AddModifierCommand;
  [CommandType.REMOVE_SYMBOL]: BaseCommand;
  [CommandType.REMOVE_ALL_SYMBOLS]: BaseCommand;
  [CommandType.CALCULATE_RESULT]: BaseCommand;
  [CommandType.ADD_MATH_CONSTANT]: AddConstantCommand;
};

// Events

export enum EventType {
  VALUE_CHANGED = 'value-changed',
  MATH_OPERATION_ADDED = 'math-operation-added',
  LEFT_PARENTHESES_ADDED = 'left-parentheses-added',
  RIGHT_PARENTHESES_ADDED = 'right-parentheses-added',
  MODIFIER_ADDED = 'modifier-added',
  RESULT_CALCULATED = 'result-calculated',
  MATH_CONSTANT_ADDED = 'math-constant-added',
}

export interface BaseEvent {
  type: EventType;
}

export interface ValueChangedEvent extends BaseEvent {
  addedValue: string;
  value: string;
}

export interface OperationAddedEvent extends BaseEvent {
  operation: MathAction;
}

export interface ModifierAddedEvent extends BaseEvent {
  modifier: MathModifier;
}

export interface ResultCalculatedEvent extends BaseEvent {
  result: string | null;
  expression: ExpressionValue[];
  events: Event[];
}

export interface MathConstantAddedEvent extends BaseEvent {
  constant: MathConstant;
  value?: string;
}

export type Event =
  | BaseEvent
  | ValueChangedEvent
  | OperationAddedEvent
  | ModifierAddedEvent
  | ResultCalculatedEvent
  | MathConstantAddedEvent;

export type EventTypeMapping = {
  [EventType.VALUE_CHANGED]: ValueChangedEvent;
  [EventType.MATH_OPERATION_ADDED]: OperationAddedEvent;
  [EventType.LEFT_PARENTHESES_ADDED]: BaseEvent;
  [EventType.RIGHT_PARENTHESES_ADDED]: BaseEvent;
  [EventType.MODIFIER_ADDED]: ModifierAddedEvent;
  [EventType.RESULT_CALCULATED]: ResultCalculatedEvent;
  [EventType.MATH_CONSTANT_ADDED]: MathConstantAddedEvent;
};

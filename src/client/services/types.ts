import { MathOperation, PrefixModifier, ExpressionValue, MathConstant, MeasurementType } from 'stores/types';

// Commands

export enum CommandType {
  INIT = 'init',
  ADD_VALUE = 'add-value',
  ADD_MATH_OPERATION = 'add-math-operation',
  ADD_LEFT_PARENTHESES = 'add-left-parentheses',
  ADD_RIGHT_PARENTHESES = 'add-right-parentheses',
  ADD_MODIFIER = 'add-modifier',
  REMOVE_SYMBOL = 'remove-symbol',
  REMOVE_ALL_SYMBOLS = 'remove-all-symbols',
  CALCULATE_RESULT = 'calculate-result',
  ADD_MATH_CONSTANT = 'add-math-constant',
  SET_MEASUREMENT = 'set-measurement',
}

export interface BaseCommand {
  type: CommandType;
}

export interface AddValueCommand extends BaseCommand {
  value: string;
}

export interface AddMathOperationCommand extends BaseCommand {
  operation: MathOperation;
}

export interface AddModifierCommand extends BaseCommand {
  modifier: PrefixModifier;
}

export interface AddConstantCommand extends BaseCommand {
  constant: MathConstant;
}

export interface CalculateResultCommand extends BaseCommand {
  expression: ExpressionValue[];
  result: string;
}

export interface SetMeasurementCommand extends BaseCommand {
  measurement: MeasurementType;
}

export type Command =
  | BaseCommand
  | AddValueCommand
  | AddMathOperationCommand
  | AddModifierCommand
  | AddConstantCommand
  | CalculateResultCommand
  | SetMeasurementCommand;

export type CommandTypeMapping = {
  [CommandType.INIT]: BaseCommand;
  [CommandType.ADD_VALUE]: AddValueCommand;
  [CommandType.ADD_MATH_OPERATION]: AddMathOperationCommand;
  [CommandType.ADD_LEFT_PARENTHESES]: BaseCommand;
  [CommandType.ADD_RIGHT_PARENTHESES]: BaseCommand;
  [CommandType.ADD_MODIFIER]: AddModifierCommand;
  [CommandType.REMOVE_SYMBOL]: BaseCommand;
  [CommandType.REMOVE_ALL_SYMBOLS]: BaseCommand;
  [CommandType.CALCULATE_RESULT]: CalculateResultCommand;
  [CommandType.ADD_MATH_CONSTANT]: AddConstantCommand;
  [CommandType.SET_MEASUREMENT]: SetMeasurementCommand;
};

// Events

export enum EventType {
  INITIALIZED = 'initialized',
  VALUE_CHANGED = 'value-changed',
  MATH_OPERATION_ADDED = 'math-operation-added',
  LEFT_PARENTHESES_ADDED = 'left-parentheses-added',
  RIGHT_PARENTHESES_ADDED = 'right-parentheses-added',
  MODIFIER_ADDED = 'modifier-added',
  RESULT_CALCULATED = 'result-calculated',
  MATH_CONSTANT_ADDED = 'math-constant-added',
  MEASUREMENT_CHANGED = 'measurement-changed',
}

export interface BaseEvent {
  type: EventType;
}

export interface ValueChangedEvent extends BaseEvent {
  addedValue: string;
  value: string;
}

export interface OperationAddedEvent extends BaseEvent {
  operation: MathOperation;
}

export interface ModifierAddedEvent extends BaseEvent {
  modifier: PrefixModifier;
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

export interface MeasurementChangedEvent extends BaseEvent {
  measurement: MeasurementType;
}

export type Event =
  | BaseEvent
  | ValueChangedEvent
  | OperationAddedEvent
  | ModifierAddedEvent
  | ResultCalculatedEvent
  | MathConstantAddedEvent
  | MeasurementChangedEvent;

export type EventTypeMapping = {
  [EventType.INITIALIZED]: BaseEvent;
  [EventType.VALUE_CHANGED]: ValueChangedEvent;
  [EventType.MATH_OPERATION_ADDED]: OperationAddedEvent;
  [EventType.LEFT_PARENTHESES_ADDED]: BaseEvent;
  [EventType.RIGHT_PARENTHESES_ADDED]: BaseEvent;
  [EventType.MODIFIER_ADDED]: ModifierAddedEvent;
  [EventType.RESULT_CALCULATED]: ResultCalculatedEvent;
  [EventType.MATH_CONSTANT_ADDED]: MathConstantAddedEvent;
  [EventType.MEASUREMENT_CHANGED]: MeasurementChangedEvent;
};

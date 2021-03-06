import { MathOperation, PrefixModifier, MeasurementType, PostfixModifier } from 'stores/types';

import { CalculatorAdapter } from 'adapters/calculator';

import { format } from 'lib/numbers';

const adapter = new CalculatorAdapter();

export function addLeftParentheses(): void {
  adapter.addLeftParentheses();
}

export function addRightParentheses(): void {
  adapter.addRightParentheses();
}

export function addOperation(operation: MathOperation): void {
  adapter.setOperation(operation);
}

export function setValue(value: string): void {
  adapter.setValue(value);
}

export function clean(): void {
  adapter.clean();
}

export async function calculateResult(): Promise<string> {
  const calculationResult = await adapter.calculate();
  return format(calculationResult);
}

export function validate(): Promise<boolean> {
  return adapter.validate();
}

export function addConstant(value: string): void {
  adapter.addConstant(value);
}

export function addPrefixModifier(modifier: PrefixModifier): void {
  adapter.addPrefixModifier(modifier);
}

export function addPostfixModifier(modifier: PostfixModifier): void {
  adapter.addPostfixModifier(modifier);
}

export function setMeasurement(measurement: MeasurementType): void {
  adapter.setMeasurement(measurement);
}

export function addExponent(): void {
  adapter.addExponent();
}

export function setExponentPower(power: string): void {
  adapter.setExponent(power);
}

export function addPower(): void {
  adapter.addPower();
}

export function addRoot(): void {
  adapter.addRoot();
}

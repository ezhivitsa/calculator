import { MathOperation, PrefixModifier } from 'stores/types';

import { CalculatorAdapter } from 'adapters/calculator';

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

export function calculateResult(): Promise<string> {
  return adapter.calculate();
}

export function validate(): Promise<boolean> {
  return adapter.validate();
}

export function addConstant(value: string): void {
  adapter.addConstant(value);
}

export function addModifier(modifier: PrefixModifier): void {
  adapter.addPrefixModifier(modifier);
}

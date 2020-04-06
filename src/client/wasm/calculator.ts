import { Calculator } from 'pkg/calculator.d.ts';

export const getCalculator = async (): Promise<Calculator> => {
  const wasmCalculator = await import('../../../pkg/calculator');
  return wasmCalculator.Calculator.new();
};

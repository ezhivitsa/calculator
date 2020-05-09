const NUMBER_FROM_ZERO_NUMBER_REG_EXP = /^-?0\.?\d*$/;
const NUMBER_FROM_NOT_ZERO_REG_EXP = /^-?[1-9]\d*\.?\d*$/;
const NUMBER_FROM_DOT_REG_EXP = /^-?\.\d*$/;

const NATURAL_NUMBER_REG_EXP = /^[1-9]\d*$/;

const ZERO_REG_EXP = /^-?0$/;
const REAL_NUMBER_FROM_ZERO_NUMBER_REG_EXP = /^-?0\.\d+$/;
const REAL_NUMBER_FROM_NOT_ZERO_REG_EXP = /^-?[1-9]\d*\.\d+$/;

export function isNumber(value: string): boolean {
  return (
    NUMBER_FROM_NOT_ZERO_REG_EXP.test(value) ||
    NUMBER_FROM_ZERO_NUMBER_REG_EXP.test(value) ||
    NUMBER_FROM_DOT_REG_EXP.test(value)
  );
}

export function isNaturalNumber(value: string): boolean {
  return NATURAL_NUMBER_REG_EXP.test(value);
}

export function isRealNumber(value: string): boolean {
  return (
    ZERO_REG_EXP.test(value) ||
    REAL_NUMBER_FROM_ZERO_NUMBER_REG_EXP.test(value) ||
    REAL_NUMBER_FROM_NOT_ZERO_REG_EXP.test(value)
  );
}

const NUMBER_FROM_ZERO_NUMBER_REG_EXP = /^-?0\.?\d*$/;
const NUMBER_FROM_NOT_ZERO_REG_EXP = /^-?[1-9]\d*\.?\d*$/;
const NATURAL_NUMBER_REG_EXP = /^[1-9]\d*$/;

export const isNumber = (value: string): boolean => {
  return NUMBER_FROM_NOT_ZERO_REG_EXP.test(value) || NUMBER_FROM_ZERO_NUMBER_REG_EXP.test(value);
};

export const isNaturalNumber = (value: string): boolean => {
  return NATURAL_NUMBER_REG_EXP.test(value);
};

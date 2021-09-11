import { ZERO_VALUE, MINUS_SIGN, MAX_NATURAL_PART, MAX_FRACTION_PART, DOT, EXPONENT } from 'constants/app';

const NUMBER_FROM_ZERO_NUMBER_REG_EXP = /^-?0\.?\d*$/;
const NUMBER_FROM_NOT_ZERO_REG_EXP = /^-?[1-9]\d*\.?\d*$/;
const NUMBER_FROM_DOT_REG_EXP = /^-?\.\d*$/;

const NATURAL_NUMBER_REG_EXP = /^-?[1-9]\d*$/;

const ZERO_REG_EXP = /^-?0$/;
const REAL_NUMBER_FROM_ZERO_NUMBER_REG_EXP = /^-?0\.\d+$/;
const REAL_NUMBER_FROM_NOT_ZERO_REG_EXP = /^-?[1-9]\d*\.\d+$/;

const START_ZEROS_REG_EXP = /^0+/;
const END_ZEROS_REG_EXP = /0+$/;

function round(value: string, symbolsCount: number): string {
  if (value.length <= symbolsCount) {
    return value.replace(END_ZEROS_REG_EXP, '');
  }

  const result = value.slice(0, symbolsCount - 1);
  const last = Math.round(parseFloat(`${value[symbolsCount]}.${value[symbolsCount + 1]}`));
  return `${result}${last}`.replace(END_ZEROS_REG_EXP, '');
}

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

export function format(value: string): string {
  const sign = value[0] === MINUS_SIGN ? MINUS_SIGN : '';
  const valueWithoutSign = value.replace(MINUS_SIGN, '');

  const parts = valueWithoutSign.split(DOT);
  const [naturalPart] = parts;
  const fractionPart = parts[1] || '';

  if (naturalPart.length > MAX_NATURAL_PART) {
    const power = naturalPart.length - 1;

    const fraction = `${naturalPart.slice(1)}${fractionPart}`;
    return `${sign}${naturalPart[0]}.${round(fraction, MAX_NATURAL_PART - 1)}${EXPONENT}${power}`;
  }

  if (fractionPart.length > MAX_FRACTION_PART) {
    const [zeros] = fractionPart.match(START_ZEROS_REG_EXP) || [];

    if (zeros && zeros.length >= MAX_FRACTION_PART && naturalPart === ZERO_VALUE) {
      const fraction = fractionPart.slice(zeros.length);
      return `${sign}${fractionPart[zeros.length]}.${round(fraction, MAX_FRACTION_PART - 1)}${EXPONENT}${MINUS_SIGN}${
        zeros.length
      }`;
    }

    return `${sign}${naturalPart}.${round(fractionPart, MAX_FRACTION_PART)}`;
  }

  return value;
}

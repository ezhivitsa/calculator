export enum MathOperation {
  Divide,
  Multiply,
  Minus,
  Plus,
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

export enum PostfixModifier {
  Percent,
  Factorial,
  Exp,
}

export enum PrefixModifier {
  Sin,
  Asin,
  Ln,
  Cos,
  Acos,
  Log,
  Tan,
  Atan,
  SquareRoot,
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

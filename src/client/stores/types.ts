export enum MathOperation {
  Divide,
  Multiply,
  Minus,
  Plus,
}

export enum PostfixModifier {
  Factorial,
  Percent,
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

export enum MeasurementType {
  Rad,
  Deg,
}

export enum NumberValue {
  Zero = '0',
  One = '1',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Dot = '.',
}

export enum Parentheses {
  Left,
  Right,
}

export enum MathConstant {
  Pi = 'pi',
  E = 'e',
  Answer = 'Ans',
  Random = 'Rnd',
}

export interface ExpressionValue {
  value: string;
  bold: boolean;
  level: number;
  insertBefore?: boolean;
}

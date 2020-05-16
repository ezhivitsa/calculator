import { LEFT_PARENTHESIS, RIGHT_PARENTHESIS } from 'constants/app';

export function countParenthesis(value: string): number {
  let result = 0;

  for (let i = 0; i < value.length; i += 1) {
    if (value[i] === LEFT_PARENTHESIS) {
      result += 1;
    }

    if (value[i] === RIGHT_PARENTHESIS) {
      result -= 1;
    }
  }

  return result;
}

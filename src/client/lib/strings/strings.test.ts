import { countParenthesis } from './strings';

describe('/lib/strings', () => {
  it('should calculate number of unclosed left parenthesis', () => {
    const number = countParenthesis('(abc(qwe)');
    expect(number).toEqual(1);
  });

  it('should calculate number of unclosed right parenthesis', () => {
    const number = countParenthesis('))abc(qwe)');
    expect(number).toEqual(-2);
  });
});

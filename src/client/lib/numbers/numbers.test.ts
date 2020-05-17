import { isNumber, isNaturalNumber, isRealNumber } from './numbers';

describe('/lib/numbers', () => {
  describe('isNumber', () => {
    it('should identify that string is a number', () => {
      const isValueNumber = isNumber('-.8');
      expect(isValueNumber).toEqual(true);
    });

    it('should identify that dot is a number', () => {
      const isValueNumber = isNumber('-.');
      expect(isValueNumber).toEqual(true);
    });

    it('should identify that string is not a number', () => {
      const isValueNumber = isNumber('00.8');
      expect(isValueNumber).toEqual(false);
    });
  });

  describe('isNaturalNumber', () => {
    it('should identify that string is a natural number', () => {
      const isValueNumber = isNaturalNumber('-90235');
      expect(isValueNumber).toEqual(true);
    });

    it('should identify that dot is not a number', () => {
      const isValueNumber = isNaturalNumber('-.');
      expect(isValueNumber).toEqual(false);
    });

    it('should identify that string is not a natural number', () => {
      const isValueNumber = isNaturalNumber('-7.3');
      expect(isValueNumber).toEqual(false);
    });
  });

  describe('isRealNumber', () => {
    it('should identify that zero is a natural number', () => {
      const isValueNumber = isRealNumber('0');
      expect(isValueNumber).toEqual(true);
    });
  });
});

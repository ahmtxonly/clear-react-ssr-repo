import decimalFormatter from './decimalFormatter';

describe('Decimal Formatter Tests', () => {
  test('return 0 if input null', () => {
    const input = null;
    const result = decimalFormatter(input);

    expect(result).toBe('0');
  });

  test('return 0,00 if input undefined', () => {
    const input = undefined;
    const result = decimalFormatter(input);

    expect(result).toBe('0,00');
  });

  test('return 100.000 if input 100000', () => {
    const input = '100000';
    const result = decimalFormatter(input);

    expect(result).toBe('100.000');
  });

  test('return 100.000,50 if input 100000.50 (with point)', () => {
    const input = '100000.50';
    const result = decimalFormatter(input);

    expect(result).toBe('100.000,50');
  });

  test('return 0,00 if input 100000,50 (with comma)', () => {
    const input = '100000,50';
    const result = decimalFormatter(input);

    expect(result).toBe('0,00');
  });
});

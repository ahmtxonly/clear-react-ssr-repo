import numeral from 'numeral';

if (numeral.locales.tr === undefined) {
  numeral.register('locale', 'tr', {
    delimiters: {
      thousands: '.',
      decimal: ',',
    },
    currency: {
      symbol: '₺',
    },
  });
}

numeral.locale('tr');

const decimalFormatter = value => {
  if (+value % 1 !== 0) {
    return numeral(+value).format('0,0.00');
  }
  return numeral(+value).format('0,0');
};

export default decimalFormatter;

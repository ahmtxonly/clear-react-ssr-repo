import Validator from 'validator';

const numerizePhone = str => {
  if (!Validator.isNumeric(str)) {
    return str && str.replace(/[^0-9]/g, '').slice(1, 11);
  }
  return str;
};

export default numerizePhone;

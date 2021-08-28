import Validator from 'validator';

const isValidEmail = value => {
  return Validator.isEmail(value);
};

export default isValidEmail;

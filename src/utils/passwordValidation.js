import Validator from 'validator';

const passwordValidation = (val, birthDate) => {
  // Hem rakam hem harf içermelidir.
  let validationOne = false;
  // En az 8, en fazla 20 karakter olmalıdır.
  let validationTwo = false;
  // 3 kere tekrar eden sayı veya 3 ardışık rakam içermemelidir.
  let validationThree;
  // Doğum yılını içermemelidir.
  let validationFour = birthDate ? !val?.includes(birthDate) : true;

  const ConsecutiveNumber = ['123', '234', '345', '456', '567', '678', '789'];

  const validationOneRule = /(?=.*\d)(?=.*[a-zA-Z]).*/;
  const validationThreeRule = /(\d)\1{2}/;

  if (validationOneRule.test(val)) {
    validationOne = true;
  }

  if (val?.length >= 8 && val?.length <= 20) {
    validationTwo = true;
  }

  const secondValidationThree = ConsecutiveNumber.filter(item => {
    return val.indexOf(item) > -1;
  });

  validationThree =
    !validationThreeRule.test(val) && !secondValidationThree.length;

  if (Validator.isEmpty(val)) {
    validationOne = false;
    validationTwo = false;
    validationThree = false;
    validationFour = false;
  }

  return [
    ['Hem rakam hem harf içermelidir.', validationOne],
    ['En az 8, en fazla 20 karakter olmalıdır.', validationTwo],
    [
      '3 kere tekrar eden sayı veya 3 ardışık rakam içermemelidir.',
      validationThree,
    ],
    ['Doğum yılını içermemelidir.', validationFour],
  ];
};

export default passwordValidation;

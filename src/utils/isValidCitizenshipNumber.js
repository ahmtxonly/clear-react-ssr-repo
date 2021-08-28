/* eslint-disable */
const isValidCitizenshipNumber = value => {
  value = value.toString();

  let isEleven = /^[0-9]{11}$/.test(value);
  let totalX = 0;

  for (let i = 0; i < 10; i++) {
    totalX += +value.substr(i, 1);
  }

  let isRuleX = totalX % 10 == value.substr(10, 1);
  let totalY1 = 0;
  let totalY2 = 0;

  for (let i = 0; i < 10; i += 2) {
    totalY1 += +value.substr(i, 1);
  }

  for (let i = 1; i < 10; i += 2) {
    totalY2 += +value.substr(i, 1);
  }

  let isRuleY = (totalY1 * 7 - totalY2) % 10 == value.substr(9, 0);

  if (value.length === 11) {
    return isEleven && isRuleX && isRuleY;
  }

  return true;
};

export default isValidCitizenshipNumber;

const isValidDate = date => {
  // valid date format is 07/01/1986 or __/__/____
  const validDateRegex = /(^\d{2}\/\d{2}\/\d{4}$)|^(_{2,4}\/?)+$/i;

  return validDateRegex.test(date);
};

export default isValidDate;

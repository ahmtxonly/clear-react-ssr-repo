const syncLocalStorage = () => {
  return next => action => {
    const returnValue = next(action);
    return returnValue;
  };
};

export default syncLocalStorage;

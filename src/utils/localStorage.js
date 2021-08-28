class LocalStorage {
  get = key => {
    if (__BROWSER__) {
      return JSON.parse(localStorage?.getItem(`desktop/${key}`));
    }

    return null;
  };

  set = (key, value) => {
    return localStorage?.setItem(`desktop/${key}`, JSON.stringify(value));
  };

  remove = (key, value) => {
    // if remove func have a value, this method deletes the value from the object
    if (value) {
      const item = JSON.parse(localStorage?.getItem(`desktop/${key}`));

      if (item) {
        delete item[value];
      }
      return localStorage?.setItem(`desktop/${key}`, JSON.stringify(item));
      // else, this method deletes the all object
    }
    return localStorage?.removeItem(`desktop/${key}`);
  };

  clear = () => {
    return localStorage?.clear();
  };
}

export default new LocalStorage();

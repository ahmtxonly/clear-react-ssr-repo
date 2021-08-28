import { differenceInMinutes } from 'date-fns';

import LocalStorage from './localStorage';

const EXPIRE_MINUTE_LIMIT = 30;

export const loadDataFromLocalStorage = key => {
  const storedObject = LocalStorage.get(key);

  if (storedObject) {
    const now = new Date();
    const end = storedObject.time ? new Date(storedObject.time) : now;
    const duration = differenceInMinutes(now, end);

    if (duration > EXPIRE_MINUTE_LIMIT) {
      LocalStorage.remove(key);

      return null;
    }

    return storedObject[key];
  }

  return null;
};

export const storeDataToStorage = (type, data) => {
  LocalStorage.set(type, { [type]: data, time: new Date() });
};

import {
  // format,
  getDate,
  getMonth,
  getYear,
  parse,
  // startOfDay,
  // setMonth,
  getHours,
  getMinutes,
  differenceInDays,
  differenceInHours,
  formatDistanceStrict,
  format,
  parseISO,
} from 'date-fns';
import trLocale from 'date-fns/locale/tr';

export { differenceInHours } from 'date-fns';

const javaTimeFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS";
// TODO: check date parse format https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
const javaTimeFormatWithTimeZone = "yyyy-MM-dd'T'HH:mm:ss.SSS'+0300'";

export const MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

const days = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
];

export const splitDateWithTimeZone = value => {
  const date = parse(value, javaTimeFormatWithTimeZone, new Date());

  return {
    day: getDate(date),
    month: getMonth(date) + 1,
    year: getYear(date),
    hour: getHours(date),
    minutes: getMinutes(date) < 10 ? `0${getMinutes(date)}` : getMinutes(date),
  };
};

export const splitDate = value => {
  const date = parse(value, javaTimeFormat, new Date());

  return {
    day: getDate(date),
    month: getMonth(date) + 1,
    year: getYear(date),
    hour: getHours(date),
    minutes: getMinutes(date),
  };
};

export const getMillisecond = value => {
  const millisecond = parse(value, javaTimeFormat, new Date().getTime());
  return millisecond;
};

export const splitIsoDate = value => {
  const date = parseISO(value, new Date());

  return {
    day: getDate(date),
    month: getMonth(date) + 1,
    year: getYear(date),
    hour: `0${getHours(date)}`.slice(-2),
    minutes: `0${getMinutes(date)}`.slice(-2),
  };
};

export const dateConverter = date => {
  const dateData = date.replace(' ', '-');
  const splitedDate = splitDate(dateData);
  const couponDate = `${splitedDate.day}/${splitedDate.month}/${splitedDate.year} ${splitedDate.hour}:${splitedDate.minutes}`;
  return couponDate;
};

export const distanceFormatter = date => {
  const today = new Date();
  // if the target date is far than a week than return that date in a special format
  if (differenceInDays(date, today) >= 7) {
    return format(date, 'd MMMM EEEE', {
      locale: trLocale,
    });
  }
  // if target target is in the week before return human readable distance in Turkish
  return formatDistanceStrict(date, today, {
    locale: trLocale,
    unit: 'day',
    roundingMethod: 'ceil',
  });
};

export const dateParser = date => {
  return parseISO(date);
};

export const formatDate = (date, formatType) => {
  // date: "2020-10-26T18:00:00.000"
  // ie: formatType: 'HH mm' => 18 00
  return format(dateParser(date), formatType);
};

export const dateDistanceConverter = data => {
  // This function has created in order to handle dates which looks like this 14/10/2020 09:50
  // And returns proper date for visuality.
  const date = data.split(' ')[0]; // 14/10/2020
  const hour = data.split(' ')[1]; // 09:12

  const dateSplit = date.split('/'); // [14,10,2020]
  const hoursSplit = hour.split(':'); // [09,12]

  const dateFnsFormat = new Date(
    dateSplit[2],
    dateSplit[1] - 1,
    dateSplit[0],
    hoursSplit[0],
    hoursSplit[1]
  );

  const dayNumber = new Date(dateFnsFormat).getDay();

  if (differenceInDays(new Date(), dateFnsFormat) < 1) {
    return `${differenceInHours(new Date(), dateFnsFormat)} Saat Önce`;
  }

  return `${dateSplit[0]} ${MONTHS[dateSplit[1] - 1]} ${days[dayNumber - 1]}`;
};

export const dateMonthConverter = date => {
  const converTime = splitDateWithTimeZone(date);

  return `${converTime.day} ${MONTHS[converTime.month - 1]} ${converTime.year}`;
};

export const turkishStringToDateConverter = data => {
  // This function converts dates like "31 Aralık 2020" to 31/12/2020
  const splitted = data.split(' ');
  if (MONTHS.includes(splitted[1])) {
    // check for dates like "Son Gün"
    const day = splitted[0];
    const month = MONTHS.indexOf(splitted[1]);
    const year = splitted[2];
    return new Date(year, month, day);
  }
  return undefined;
};

export const dateToTurkishStringConverter = (
  data,
  dateFormat = javaTimeFormat
) => {
  // This function converts a date with given format into Turkish
  // e.g. 31/10/2020 with the format of dd-MM-yyyy should converted into 31 Ekim 2020
  const parsedDate = parse(data, dateFormat, new Date());

  const day = getDate(parsedDate);
  const month = MONTHS[getMonth(parsedDate) - 1];
  const year = getYear(parsedDate);

  return {
    day,
    month,
    year,
    fullText: `${day} ${month} ${year}`,
  };
};

export const formatDateToTurkishDate = date =>
  // 2 Aralık Çarşamba
  format(date, 'd MMMM EEEE', {
    locale: trLocale,
  });

export const convertSecondsToDaysHoursMinutes = data => {
  let seconds = +data;

  const day = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;

  const hour = Math.floor(seconds / 3600);
  seconds %= 3600;

  const minute = Math.floor(seconds / 60);

  return { days: day, hours: hour, minutes: minute };
};

export const milliSecondToDate = value => {
  // value: 1605139541000
  // return : 11/12/2020 05:03
  return format(value, 'MM/dd/yyyy hh:mm');
};

export const milliSecondToHourMinutes = value => {
  const minutes = parseInt((value / 60000) % 60, 10);
  const hours = parseInt((value / 3600000) % 24, 10);
  const seconds = parseInt((value / 1000) % 60, 10);
  return {
    hours,
    minutes,
    seconds,
  };
};

export const milliSecondToIsoFormat = value => {
  // value: 1605139541000
  // return : 11/12/2020 00:00:00
  return format(value, 'yyyy-MM-dd 23:59:59');
};

export const timeToUTCFormat = value => {
  const time = {
    date: format(new Date(value), 'dd.MM.yyyy'),
    hours: format(new Date(value), 'HH:mm'),
  };

  return `${time.date} ${time.hours}`;
};

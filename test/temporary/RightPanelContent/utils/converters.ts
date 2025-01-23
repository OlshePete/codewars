import { isNumber } from '@uds/utils';

export const getTermination = (number: number, titles: Array<string>) => {
  const cases = [2, 0, 1, 1, 1, 2];

  return titles[
    number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
  ];
};

export const declineWord = (number: number, titles: Array<string>) =>
  `${number} ${getTermination(number, titles)}`;

export const declineWordAll = (number: number, titles: Array<string>) =>
  number % 10 === 1 ? titles[1] : titles[2];

export const padStart = (number: number) => (number < 10 ? `0${number}` : number);

export const convertToLocalDate = (time: number) => {
  const date = new Date(time * 1000);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  if (date.getHours() !== 0 && date.getTime() !== 0) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return date.toLocaleString('ru-Ru', options);
};

export function extractDateAndTime(
  timestamp: number | undefined,
  inMillisecond: boolean = false,
): Record<'date' | 'time', number | undefined> {
  if (!timestamp) return { date: undefined, time: undefined };
  const date = new Date(timestamp * (inMillisecond ? 1 : 1000));
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const dateTimestamp = new Date(year, month, day).getTime() / 1000;
  const timeTimestamp = hour * 3600 + minute * 60 + second;

  return {
    date: dateTimestamp,
    time: timeTimestamp - (timeTimestamp % 60),
  };
}

export const isDateOrTimeInPast = (
  dateValue: number | undefined,
  timeValue: number | undefined | '',
) => {
  const now = new Date().getTime() / 1000; // current timestamp in seconds
  const nowTimestamp = extractDateAndTime(now);
  const dateNow = nowTimestamp.date;
  const timeNow = nowTimestamp.time;

  const result = {
    date: false,
    time: false,
  };

  if (dateValue !== undefined && dateNow) {
    if (dateValue < dateNow) {
      result.date = true;
      result.time = true;
    }

    if (dateValue === dateNow && timeNow && timeValue) {
      if (timeNow > timeValue) result.time = true;
    }
  }

  return result;
};

export function getTimeString(timeInSec: number, withSeconds: boolean = false): string {
  if (!isNumber(timeInSec)) return '';
  const hours = Math.floor(timeInSec / 3600);
  const minutes = Math.floor((timeInSec % 3600) / 60);
  const seconds = timeInSec % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}${
    !withSeconds ? '' : ':' + String(seconds).padStart(2, '0')
  }`;
}

export function getMessageDateTimeString(timestamp: number | undefined | null): {
  date: string;
  time: string;
} {
  if (!timestamp) return { date: '', time: '' };
  const dateString = new Date(timestamp).toLocaleString('ru-RU');
  const [date, time] = dateString.split(', ');
  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(timestamp);

  return { date: formattedDate, time };
}

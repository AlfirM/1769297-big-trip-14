import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomItem = (ITEMS) => {
  const randomIndex = getRandomInteger(0, ITEMS.length - 1);

  return ITEMS[randomIndex];
};

export const getDuration = (timeStart, timeEnd) =>
{
  const hours_in_day = 24;
  const minutes_in_hour = 60;

  const duration = dayjs(timeEnd).diff(dayjs(timeStart), 'm');

  const hours = Math.floor(duration / minutes_in_hour) % hours_in_day;

  const days = Math.floor(duration / (hours_in_day * minutes_in_hour));

  const minutes = duration % minutes_in_hour;

  if (days === 0 && hours === 0 && minutes > 0) {
    return `${minutes}M`;
  } else if (days === 0 && hours > 0) {
    return `${hours}H ${minutes}M`;
  } else if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  }
};

export const humanizeDate = (dueDate, format) => {
  return dayjs(dueDate).format(format);
};

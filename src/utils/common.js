import dayjs from 'dayjs';

const HOURS_IN_DAY = 24;
const MINUTEST_IN_HOUR = 60;

export const getDuration = (timeStart, timeEnd) =>
{
  const duration = dayjs(timeEnd).diff(dayjs(timeStart), 'm');

  return formatDuration(duration);
};

export const humanizeDate = (dueDate, format) => {
  return dayjs(dueDate).format(format);
};

export const formatDuration = (duration) => {

  const hours = Math.floor(duration / MINUTEST_IN_HOUR) % HOURS_IN_DAY;

  const days = Math.floor(duration / (HOURS_IN_DAY * MINUTEST_IN_HOUR));

  const minutes = duration % MINUTEST_IN_HOUR;

  if (days === 0 && hours === 0 && minutes > 0) {
    return `${minutes}M`;
  }
  if (days === 0 && hours > 0) {
    return `${hours}H ${minutes}M`;
  }
  return `${days}D ${hours}H ${minutes}M`;
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

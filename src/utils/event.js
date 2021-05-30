import dayjs from 'dayjs';

export const sortByTime = (eventA, eventB) => {
  return dayjs(eventB.timeEnd).diff(dayjs(eventA.timeEnd));
};

export const sortByPrice = (eventA, eventB) => {
  return eventB.cost - eventA.cost;
};

export const sortByDuration = (eventA, eventB) => {
  const eventADuration = dayjs(eventA.timeEnd).diff(dayjs(eventA.timeStart), 'm');
  const eventBDuration = dayjs(eventB.timeEnd).diff(dayjs(eventB.timeStart), 'm');
  return eventBDuration - eventADuration;
};

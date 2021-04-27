import dayjs from 'dayjs';

export const sortByTime = (eventA, eventB) => {
  return dayjs(eventB.timeEnd).diff(dayjs(eventA.timeEnd));
};
  
export const sortByPrice = (eventA, eventB) => {
  return eventB.cost - eventA.cost;
};
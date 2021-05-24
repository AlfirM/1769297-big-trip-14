import { FilterType } from '../const';

export const filter = {
  [FilterType.EVERYTHING]: (events) => events.slice(),
  [FilterType.FUTURE]: (events) => events.filter(({ timeStart }) => new Date(timeStart) >= new Date()),
  [FilterType.PAST]: (events) => events.filter(({ timeEnd }) => new Date(timeEnd) < new Date()),
};

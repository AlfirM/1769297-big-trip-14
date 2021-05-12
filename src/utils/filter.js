import { FilterType } from '../const';

export const filter = {
  [FilterType.EVERYTHING]: (events) => events.slice(),
  [FilterType.FUTURE]: (events) => events.filter(({ timeStart }) => timeStart >= new Date()),
  [FilterType.PAST]: (events) => events.filter(({ timeEnd }) => timeEnd < new Date()),
};

import AbstractView from './abstract.js';
import dayjs from 'dayjs';

const MAX_EVENTS_COUNT_IN_INFO_BOARD = 3;

const createTripInfoTemplate = (events) => {
  let routeInfo = '';

  if (events.length === 0) {
    return '';
  }

  const sortEvents = events.slice();

  const eventsDatesInfo = sortEvents.map((event) => {
    return {name: event.destination.name, timeStart: event.timeStart, timeEnd: event.timeEnd};
  });

  const firstEventData = eventsDatesInfo.sort((a, b) => b.timeStart - a.timeStart)[eventsDatesInfo.length - 1];
  const lastEventData = eventsDatesInfo.sort((a, b) => b.timeEnd - a.timeEnd)[0];

  if (events.length > MAX_EVENTS_COUNT_IN_INFO_BOARD) {
    routeInfo = `${firstEventData.name} &mdash; ... &mdash; ${lastEventData.name}`;
  }

  routeInfo = `${firstEventData.name} &mdash; ${lastEventData.name}`;

  const dayStart = dayjs(firstEventData.timeStart).format('MMM D');
  const dayEnd = dayjs(lastEventData.timeEnd).format('MMM D');

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${routeInfo}</h1>
              <p class="trip-info__dates">${dayStart}&nbsp;&mdash;&nbsp;${dayEnd}</p>
            </div>
          </section>`;
};

export default class TripInfo extends AbstractView{
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createTripInfoTemplate(this._event);
  }
}

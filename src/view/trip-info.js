import AbstractView from './abstract.js';
import dayjs from 'dayjs';

const createTripInfoTemplate = (events) => {
  const max_events_count_in_info_board = 3;
  let cities = '';

  if (events.length === 0) {
    return '';
  }

  if (events.length > max_events_count_in_info_board) {
    cities = `${events[0].destination.city} &mdash; ... &mdash; ${events[events.length - 1].destination.city}`;
  }
  else {
    cities = `${events[0].destination.city} &mdash; ${events[events.length - 1].destination.city}`;
  }

  const dayStart = dayjs(events[0].timeStart).format('MMM D');
  const dayEnd = dayjs(events[events.length - 1].timeEnd).format('MMM D');

  return `<section class="trip-main__trip-info  trip-info">
              <div class="trip-info__main">
                <h1 class="trip-info__title">${cities}</h1>
                <p class="trip-info__dates">${dayStart}&nbsp;&mdash;&nbsp;${dayEnd}</p>
              </div>
            </section>`;
};

export default class Info extends AbstractView{
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createTripInfoTemplate(this._event);
  }
}

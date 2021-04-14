import { createElement } from '../utils.js';

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

  return `<section class="trip-main__trip-info  trip-info">
              <div class="trip-info__main">
                <h1 class="trip-info__title">${cities}</h1>
                <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
              </div>
            </section>`;
};

export default class Info {
  constructor(event) {
    this._event = event;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._event);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

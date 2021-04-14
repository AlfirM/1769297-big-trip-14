import { createElement } from '../utils.js';

const createTripCostTemplate = (events) => {
  let totalCost = 0;

  events.forEach((event) => {
    totalCost += event.cost;
  });

  events.forEach((event) => {
    if (event.offers.length !== 0) {
      event.offers.forEach((offer) => {
        totalCost += offer.price;
      });
    }
  });

  return `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`;
};

export default class TripCost {
  constructor(events) {
    this._element = null;
    this._events = events;
  }

  getTemplate() {
    return createTripCostTemplate(this._events);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  clearElement() {
    this._element = null;
  }
}

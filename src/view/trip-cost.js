import AbstractView from './abstract.js';

const createTripCostTemplate = (events) => {
  let totalCost = 0;

  events.forEach((event) => {
    totalCost += event.cost;
  });

  events.forEach((event) => {
    if (event.offers.length) {
      event.offers.forEach((offer) => {
        totalCost += offer.price;
      });
    }
  });

  return `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`;
};

export default class TripCost extends AbstractView{
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripCostTemplate(this._events);
  }
}

import Observer from '../utils/observer.js';

export default class Event extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();
    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this._events = [...this._events.slice(0, index), update, ...this._events.slice(index + 1)];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [update, ...this._events];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Cannot delete unexisting event');
    }

    this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)];

    this._notify(updateType);
  }


  static adaptToClient(event) {
    const adaptedEvent = Object.assign({}, event, {
      cost: event.base_price,
      timeStart: event.date_from,
      timeEnd: event.date_to,
      destination: event.destination,
      id: event.id,
      isFavorite: event.is_favorite,
      offers: event.offers,
      type: event.type,
    });

    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign({}, event, {
      base_price: event.cost,
      date_from: event.timeStart ? event.timeStart : new Date(),
      date_to: event.timeEnd ? event.timeEnd : new Date(),
      destination: event.destination,
      id: event.id,
      is_favorite: event.isFavorite ? event.isFavorite : false,
      offers: event.offers ? event.offers : [],
      type: event.type ? event.type : 'taxi',
    });

    delete adaptedEvent.cost;
    delete adaptedEvent.timeStart;
    delete adaptedEvent.timeEnd;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}

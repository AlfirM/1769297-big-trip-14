import { humanizeDate} from '../utils/common.js';
import SmartView from './smart.js';
import { getOffers, getPhotos, getDescription } from '../mock/event.js';
import {CITIES} from '../const.js';
import flatpickr from 'flatpickr';
import { EventType } from '../const.js';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createOfferMarkup = (offers) => {
  if(!offers){
    return;
  }

  return offers
    .map((item) => {
      return `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="${item.title}" type="checkbox" name="event-offer-${item.title}">
          <label class="event__offer-label" for="${item.title}">
            <span class="event__offer-title">${item.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${item.price}</span>
          </label>
        </div>
        `;
    })
    .join(' ');
};

const createPhotoMarkup = (photos) => {
  if(!photos){
    return;
  }

  return photos
    .map((item) => {
      return `<img class="event__photo" src="${item}" alt="Event photo">`;
    }).join('');
};

const createDestinationList = () => {
  return CITIES.map((item) => {
    return `<option value="${item}">${item}</option>`;
  }).join('');
};

const createEventEditTemplate = (event) => {

  const type = event.type ? event.type.toLowerCase() : EventType.TAXI.toLowerCase();

  return `<form class="event event--edit" action="#" method="post">
                  <header class="event__header">
                    <div class="event__type-wrapper">
                      <label class="event__type  event__type-btn" for="event-type-toggle-1">
                        <span class="visually-hidden">Choose event type</span>
                        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                      </label>
                      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                      <div class="event__type-list">
                        <fieldset class="event__type-group">
                          <legend class="visually-hidden">Event type</legend>
                          <div class="event__type-item">
                            <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi"
                            ${type === 'taxi' ? 'checked' : ''}>
                            <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                          </div>
                          <div class="event__type-item">
                            <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus"
                            ${type === 'bus' ? 'checked' : ''}>
                            <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                          </div>
                          <div class="event__type-item">
                            <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train"
                            ${type === 'train' ? 'checked' : ''}>
                            <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                          </div>
                          <div class="event__type-item">
                            <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship"
                            ${type === 'ship' ? 'checked' : ''}>
                            <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                          </div>
                          <div class="event__type-item">
                            <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport"
                            ${type === 'transport' ? 'checked' : ''}>
                            <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
                          </div>
                          <div class="event__type-item">
                            <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive"
                            ${type === 'drive' ? 'checked' : ''}>
                            <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                          </div>
                          <div class="event__type-item">
                            <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight"
                            ${type === 'flight' ? 'checked' : ''}>
                            <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                          </div>
                          <div class="event__type-item">
                            <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in"
                            ${type === 'check-in' ? 'checked' : ''}>
                            <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                          </div>
                          <div class="event__type-item">
                            <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing"
                            ${type === 'sightseeing' ? 'checked' : ''}>
                            <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                          </div>
                          <div class="event__type-item">
                            <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant"
                            ${type === 'restaurant' ? 'checked' : ''}>
                            <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                    <div class="event__field-group  event__field-group--destination">
                      <label class="event__label  event__type-output" for="event-destination-1">
                        ${type}
                      </label>
                      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${event && event.destination ? event.destination.city : ''}" list="destination-list-1">
                      <datalist id="destination-list-1">
                        ${createDestinationList()}
                      </datalist>
                    </div>
                    <div class="event__field-group  event__field-group--time">
                      <label class="visually-hidden" for="event-start-time-1">From</label>
                      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(event ? event.timeStart : new Date(),'DD/MM/YY HH:mm')}">
                      &mdash;
                      <label class="visually-hidden" for="event-end-time-1">To</label>
                      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(event ? event.timeEnd : new Date(),'DD/MM/YY HH:mm')}">
                    </div>
                    <div class="event__field-group  event__field-group--price">
                      <label class="event__label" for="event-price-1">
                        <span class="visually-hidden">Price</span>
                        &euro;
                      </label>
                      <input class="event__input  event__input--price" id="event-price-1" type="number" min="1" name="event-price" value="${event.cost ? event.cost : ''}">
                    </div>
                    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                    <button class="event__reset-btn" type="reset">Delete</button>
                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </header>
                  <section class="event__details">
                    <section class="event__section  event__section--offers">
                      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                      <div class="event__available-offers">
                        ${createOfferMarkup((event && event.offers ? event.offers : ''))}
                      </div>
                    </section>
                    <section class="event__section  event__section--destination">
                      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                      <p class="event__destination-description">${event.destination ? event.destination.description : ''}</p>
                    </section>
                      ${createPhotoMarkup(event && event.destination && event.destination.photos ? event.destination.photos : '')}
                  </section>
                </form>`;
};

export default class EventEdit extends SmartView {
  constructor(event) {
    super();
    this._data = EventEdit.parseEventToData(event);
    this._datepickerFrom = null;
    this._datepickerTo = null;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formClickHandler = this._formClickHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._eventEditTypeChangeHandler = this._eventEditTypeChangeHandler.bind(this);
    this._eventEditDestinationChangeHandler = this._eventEditDestinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._setInnerHandlers();
    this._setDatepickerFrom();
    this._setDatepickerTo();
  }

  reset(event) {
    this.updateData(
      EventEdit.parseEventToData(event));
  }

  getTemplate() {
    return createEventEditTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickerFrom();
    this._setDatepickerTo();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setClickHandler(this._callback.click);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setDatepickerFrom() {
    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    this._datepickerFrom = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        time_24hr: true,
        defaultDate: this._data.timeStart,
        onChange: this._dateFromChangeHandler,
      });
  }
  _setDatepickerTo() {
    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }

    this._datepickerTo = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        time_24hr: true,
        minDate: this._data.timeStart,
        defaultDate: this._data.timeEnd,
        onChange: this._dateToChangeHandler,
      });
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({
      timeStart: userDate,
    });
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      timeEnd: userDate,
    });
  }

  _setInnerHandlers() {
    this.getElement().querySelectorAll('.event__type-input').forEach((e) => e.addEventListener('change', this._eventEditTypeChangeHandler));
    this.getElement().querySelector('.event__input').addEventListener('change', this._eventEditDestinationChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._priceChangeHandler);
  }

  _eventEditTypeChangeHandler(evt) {
    this.updateData({
      type: evt.target.value,
      offers: getOffers(),
    });
  }

  _eventEditDestinationChangeHandler(evt) {
    this.updateData({
      destination: { city: evt.target.value, description: getDescription(), photos: getPhotos() },
    });
  }

  _priceChangeHandler(evt) {
    const priceValue = parseInt(evt.target.value, 10);
    this.updateData({ cost: priceValue }, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventEdit.parseDataToEvent(this._data));
  }

  _formClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventEdit.parseDataToEvent(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener('submit', this._formSubmitHandler);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._formClickHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  static parseEventToData(event) {
    return Object.assign({}, event);
  }

  static parseDataToEvent(data) {
    return Object.assign({}, data);
  }
}

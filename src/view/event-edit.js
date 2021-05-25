import { humanizeDate} from '../utils/common.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import {TYPES, EventType} from '../const.js';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';


const createOfferMarkup = (allOffersOfCurrentType, checkedOffers) => {
  const allOffers = allOffersOfCurrentType.offers;

  if (!allOffers.length) {
    return '';
  }
  let optionsMarkup = '';
  allOffers.forEach((offer, index) => {
    const isChecked  = checkedOffers.find((checkedOffer) => {
      return checkedOffer.title === offer.title;
    });
    const id = `event-offer-${offer.title.toLowerCase().split(' ').join('-')}-${index + 1}`;

    optionsMarkup += `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="${id}" value="${offer.title}" type="checkbox" name="${id}" ${isChecked ? 'checked' : ''}>
    <label class="event__offer-label" for="${id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
  });
  return optionsMarkup;
};

const createTypesMarkup = (currentType) => {
  return TYPES
    .map((type) => {
      return `<div class="event__type-item">
  <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
  value="${type}" ${type.toLowerCase() === currentType ? 'checked' : ''}>
  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
</div>`;
    })
    .join(' ');
};

const createPhotoMarkup = (photos) => {
  if(!photos){
    return;
  }

  return photos
    .map((item) => {
      return `<img class="event__photo" src="${item.src}" alt="${item.description}">`;
    }).join('');
};

const createDestinationList = (destinations) => {
  if(!destinations){
    return '';
  }

  return destinations.map((item) => {
    return `<option value="${item.name}">${item.name}</option>`;
  }).join('');
};

const createEventEditTemplate = (event, destinations, offers) => {

  const type = event.type ? event.type.toLowerCase() : EventType.TAXI.toLowerCase();
  const typeOffers = offers.find((item) => {
    return item.type === type;
  });
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
                          ${createTypesMarkup(type)}
                        </fieldset>
                      </div>
                    </div>
                    <div class="event__field-group  event__field-group--destination">
                      <label class="event__label  event__type-output" for="event-destination-1">
                        ${type}
                      </label>
                      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${event && event.destination ? event.destination.name : ''}" list="destination-list-1">
                      <datalist id="destination-list-1">
                        ${createDestinationList(destinations)}
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
                    <button class="event__reset-btn" type="reset">
                    ${event.cost ? 'Delete' : 'Close'}</button>
                    <button class="event__rollup-btn event__rollup-btn--close" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </header>
                  <section class="event__details">
                    <section class="event__section  event__section--offers">
                      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                      <div class="event__available-offers">
                        ${createOfferMarkup(typeOffers, (event && event.offers ? event.offers : []))}
                      </div>
                    </section>
                    <section class="event__section  event__section--destination">
                      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                      <p class="event__destination-description">${event.destination ? event.destination.description : ''}</p>
                    </section>
                      ${createPhotoMarkup(event && event.destination && event.destination.pictures ? event.destination.pictures : '')}
                  </section>
                </form>`;
};

export default class EventEdit extends SmartView {
  constructor(event, offers, destinations) {
    super();
    this._offers = offers;
    this._destinations = destinations;
    this._data = EventEdit.parseEventToData(event);
    this._datepickerFrom = null;
    this._datepickerTo = null;
    this._checkedOffers = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formClickHandler = this._formClickHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._eventEditTypeChangeHandler = this._eventEditTypeChangeHandler.bind(this);
    this._eventEditDestinationChangeHandler = this._eventEditDestinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickerFrom();
    this._setDatepickerTo();
  }

  reset(event) {
    this.updateData(
      EventEdit.parseEventToData(event));
  }

  getTemplate() {
    return createEventEditTemplate(this._data, this._destinations, this._offers);
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
    this.getElement().querySelector('.event__details').addEventListener('change', this._offersChangeHandler);
  }

  _eventEditTypeChangeHandler(evt) {
    this.updateData({
      type: evt.target.value,
      offers: [],
    });
  }

  _eventEditDestinationChangeHandler(evt) {
    evt.preventDefault();

    const isTrueDestination = this._destinations.some((item) => {
      return item.name === evt.target.value;
    });

    if (!isTrueDestination) {
      return evt.target.setCustomValidity('This destination was not found');
    }

    const destination = this._destinations.filter((item) => item.name === evt.target.value)[0];
    this.updateData({
      destination: destination,
    });
  }

  _priceChangeHandler(evt) {
    const priceValue = parseInt(evt.target.value, 10);
    this.updateData({ cost: priceValue }, true);
  }

  _offersChangeHandler(evt) {
    const typeOffers = this._data.offers ? this._data.offers : [];
    const eventType = this._data.type ? this._data.type : 'taxi';

    const selectedOfferName = evt.target.value;

    const selectedOfferIndex = typeOffers.findIndex((offer) => {
      return offer.title === selectedOfferName;
    });

    if (selectedOfferIndex < 0) {
      const currentOffer = this._offers.find((offers) => {
        return offers.type === eventType;
      }).offers.find((offer) => {
        return offer.title === selectedOfferName;
      });

      this.updateData({
        offers: [currentOffer, ...typeOffers],
      }, true);
    } else {
      this.updateData({
        offers: [...typeOffers.slice(0, selectedOfferIndex), ...typeOffers.slice(selectedOfferIndex + 1)],
      }, true);
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    const newDestination= this.getElement().querySelector('#event-destination-1');
    if (this._destinations.map((destination) => destination.name).indexOf(newDestination.value) === -1) {
      newDestination.value = '';
      return;
    }
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
    data = Object.assign({}, data);

    return data;
  }
}

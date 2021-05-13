import MenuView from './view/menu.js';
import FilterPresenter from './presenter/filter.js';
import EventListView from './view/event-list.js';
import {generateEvent} from './mock/event.js';
import {render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import EventsModel from './model/event.js';
import FilterModel from './model/filter.js';

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

const navigationElement = document.querySelector('.trip-controls__navigation');
render(navigationElement, new MenuView(), RenderPosition.BEFOREEND);

const tripMainElement = document.querySelector('.trip-main');
const filterElement = tripMainElement.querySelector('.trip-controls__filters');

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

const tripEventsElement = document.querySelector('.trip-events');
const tripEventListComponent = new EventListView();
render(tripEventsElement, tripEventListComponent, RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripEventsElement, tripEventListComponent, tripMainElement, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(filterElement, filterModel, eventsModel);

filterPresenter.init();
tripPresenter.init();


document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});


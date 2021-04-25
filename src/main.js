import MenuView from './view/menu.js';
import FilterView from './view/filter.js';
import EventListView from './view/event-list.js';
import {generateEvent} from './mock/event.js';
import {render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/trip.js';

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

const navigationElement = document.querySelector('.trip-controls__navigation');
render(navigationElement, new MenuView(), RenderPosition.BEFOREEND);

const tripMainElement = document.querySelector('.trip-main');

const filterElement = document.querySelector('.trip-controls__filters');
render(filterElement, new FilterView(), RenderPosition.BEFOREEND);

const tripEventsElement = document.querySelector('.trip-events');

const tripEventListComponent = new EventListView();
render(tripEventsElement, tripEventListComponent, RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripEventsElement, tripEventListComponent, tripMainElement);

tripPresenter.init(events);

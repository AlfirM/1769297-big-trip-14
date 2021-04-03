import {createMenuTemplate} from './view/menu.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripCostTemplate} from './view/trip-cost.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortingTemplate} from './view/sorting.js';
import {createEventTemplate} from './view/event.js';
import {createEventEditTemplate} from './view/event-edit.js';
import {createEventNewTemplate} from './view/event-new.js';

const EVENT_COUNT = 3;

const render = (container, template, position = 'beforeend') => {
  container.insertAdjacentHTML(position, template);
};

const navigationElement = document.querySelector('.trip-controls__navigation');
render(navigationElement, createMenuTemplate());

const tripMainElement = document.querySelector('.trip-main');
render(tripMainElement, createTripInfoTemplate(), 'afterbegin');

const tripInfoElement = tripMainElement.querySelector('.trip-info');
render(tripInfoElement, createTripCostTemplate());

const filterElement = document.querySelector('.trip-controls__filters');
render(filterElement, createFilterTemplate());

const tripEventsElement = document.querySelector('.trip-events');
render(tripEventsElement, createSortingTemplate());

const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

render(tripEventsListElement, createEventEditTemplate());
render(tripEventsListElement, createEventNewTemplate());

for (let i = 0; i < EVENT_COUNT; i++) {
  render(tripEventsListElement, createEventTemplate(), 'beforeend');
}
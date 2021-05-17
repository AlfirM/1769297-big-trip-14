import MenuView from './view/menu.js';
import FilterPresenter from './presenter/filter.js';
import EventListView from './view/event-list.js';
import {generateEvent} from './mock/event.js';
import {render, RenderPosition, remove} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import EventsModel from './model/event.js';
import FilterModel from './model/filter.js';
import {MenuItem} from './const.js';
import StatisticsView from './view/statistic.js';

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

const navigationElement = document.querySelector('.trip-controls__navigation');
const siteMenuComponent = new MenuView();
render(navigationElement, siteMenuComponent, RenderPosition.BEFOREEND);

const tripMainElement = document.querySelector('.trip-main');
const mainBodyElement = document.querySelector('.page-main');
const pageBodyElement = mainBodyElement.querySelector('.page-body__container');
const filterElement = tripMainElement.querySelector('.trip-controls__filters');
const newEventButtonElement =  document.querySelector('.trip-main__event-add-btn');

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

const tripEventsElement = document.querySelector('.trip-events');
const tripEventListComponent = new EventListView();
render(tripEventsElement, tripEventListComponent, RenderPosition.BEFOREEND);

let statisticsComponent = null;

const tripPresenter = new TripPresenter(tripEventsElement, tripEventListComponent, tripMainElement, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(filterElement, filterModel, eventsModel);

filterPresenter.init();
tripPresenter.init();


newEventButtonElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});

const handleSiteMenuClick = (menuItem) => {
  if (navigationElement.querySelector(`[data-value="${menuItem}"]`)
    .classList.contains('trip-tabs__btn--active')) {
    return;
  }

  siteMenuComponent.setMenuItem(menuItem);

  switch (menuItem) {
    case MenuItem.EVENTS:
      tripPresenter.showEventsTable();
      newEventButtonElement.classList.remove('trip-main__event-add-btn--hidden');
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      tripPresenter.hideEventsTable();
      statisticsComponent = new StatisticsView(events);
      render(pageBodyElement, statisticsComponent, RenderPosition.BEFOREEND);
      newEventButtonElement.classList.add('trip-main__event-add-btn--hidden');
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);



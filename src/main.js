import MenuView from './view/menu.js';
import FilterPresenter from './presenter/filter.js';
import EventListView from './view/event-list.js';
import {render, RenderPosition, remove} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import EventsModel from './model/event.js';
import FilterModel from './model/filter.js';
import {MenuItem, UpdateType} from './const.js';
import StatisticsView from './view/statistic.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic bgfa343532fse';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const navigationElement = document.querySelector('.trip-controls__navigation');
const siteMenuComponent = new MenuView();

const tripMainElement = document.querySelector('.trip-main');
const mainBodyElement = document.querySelector('.page-main');
const pageBodyElement = mainBodyElement.querySelector('.page-body__container');
const filterElement = tripMainElement.querySelector('.trip-controls__filters');
const newEventButtonElement =  document.querySelector('.trip-main__event-add-btn');

const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();

const filterModel = new FilterModel();

const tripEventsElement = document.querySelector('.trip-events');
const tripEventListComponent = new EventListView();
render(tripEventsElement, tripEventListComponent, RenderPosition.BEFOREEND);

let statisticsComponent = null;

const tripPresenter = new TripPresenter(tripEventsElement, tripEventListComponent, tripMainElement, eventsModel, filterModel,api);
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
      statisticsComponent = new StatisticsView(eventsModel.getEvents());
      render(pageBodyElement, statisticsComponent, RenderPosition.BEFOREEND);
      newEventButtonElement.classList.add('trip-main__event-add-btn--hidden');
      break;
  }
};


api
  .getOffers()
  .then((offers) => {
    tripPresenter.setOffers(offers);
  })
  .then(() => {
    api.getDestinations().then((destinations) => {
      tripPresenter.setDestinations(destinations);
    });
  })
  .then(() => {
    api.getEvents().then((events) => {
      eventsModel.setEvents(UpdateType.INIT, events);
      render(navigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    })
      .catch((error) => {
        alert(error);
        eventsModel.setEvents(UpdateType.INIT, []);
        render(navigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
        siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
      });
  });

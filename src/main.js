import MenuView from './view/menu.js';
import InfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import FilterView from './view/filter.js';
import SortingView from './view/sorting.js';
import EventView from './view/event.js';
import EventEditView from './view/event-edit.js';
import EventListView from './view/event-list.js';
import NoEventsView from './view/no_event_view.js';
import {generateEvent} from './mock/event.js';
import {render, RenderPosition} from './utils.js';

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

const navigationElement = document.querySelector('.trip-controls__navigation');
render(navigationElement, new MenuView().getElement(), RenderPosition.BEFOREEND);

const tripMainElement = document.querySelector('.trip-main');

const filterElement = document.querySelector('.trip-controls__filters'); 
render(filterElement, new FilterView().getElement(), RenderPosition.BEFOREEND);

const tripEventsElement = document.querySelector('.trip-events');
render(tripEventsElement, new SortingView().getElement(), RenderPosition.BEFOREEND);

const eventListComponent = new EventListView();
render(tripEventsElement, eventListComponent.getElement(), RenderPosition.BEFOREEND);

const renderEvent = (event) => {
  const parentElement = eventListComponent.getElement();
  const eventComponent = new EventView(event);
  const editEventComponent = new EventEditView(event);

  const replaceCardToForm = () => {
    parentElement.replaceChild(editEventComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToCard = () => {
    parentElement.replaceChild(eventComponent.getElement(), editEventComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  eventComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  editEventComponent.getElement().addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.addEventListener('keydown', onEscKeyDown);
  });

  editEventComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToCard();
    document.addEventListener('keydown', onEscKeyDown);
  });

  render(parentElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

if (events.length > 0) {

  render(tripMainElement, new InfoView(events).getElement(), RenderPosition.AFTERBEGIN);  
  const tripInfoElement = tripMainElement.querySelector('.trip-info');
  render(tripInfoElement, new TripCostView(events).getElement(), RenderPosition.BEFOREEND);

  for (let i = 0; i < EVENTS_COUNT; i++) {
    renderEvent(events[i]);
  }

} else {
  render(tripEventsElement, new NoEventsView().getElement(), RenderPosition.BEFOREEND);
}

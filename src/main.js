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
import {render, replace, RenderPosition} from './utils/render.js';

const EVENTS_COUNT = 20;

const ButtonKeys = {
  ESCAPE_SHORT: 'Esc',
  ESCAPE_FULL: 'Escape',
};

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

const navigationElement = document.querySelector('.trip-controls__navigation');
render(navigationElement, new MenuView(), RenderPosition.BEFOREEND);

const tripMainElement = document.querySelector('.trip-main');

const filterElement = document.querySelector('.trip-controls__filters');
render(filterElement, new FilterView(), RenderPosition.BEFOREEND);

const tripEventsElement = document.querySelector('.trip-events');
render(tripEventsElement, new SortingView(), RenderPosition.BEFOREEND);

const eventListComponent = new EventListView();
render(tripEventsElement, eventListComponent, RenderPosition.BEFOREEND);

const renderEvent = (event) => {
  const parentElement = eventListComponent.getElement();
  const eventComponent = new EventView(event);
  const editEventComponent = new EventEditView(event);

  const replaceCardToForm = () => {
    replace(editEventComponent, eventComponent);
  };

  const replaceFormToCard = () => {
    replace(eventComponent, editEventComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === ButtonKeys.ESCAPE_FULL || evt.key === ButtonKeys.ESCAPE_FULL) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  eventComponent.setEditClickHandler(() => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  editEventComponent.setFormSubmitHandler((evt) => {
    replaceFormToCard();
    document.addEventListener('keydown', onEscKeyDown);
  });

  editEventComponent.setClickHandler(() => {
    replaceFormToCard();
    document.addEventListener('keydown', onEscKeyDown);
  });

  render(parentElement, eventComponent, RenderPosition.BEFOREEND);
};

if (events.length > 0) {
  render(tripMainElement, new InfoView(events), RenderPosition.AFTERBEGIN);
  const tripInfoElement = tripMainElement.querySelector('.trip-info');
  render(tripInfoElement, new TripCostView(events), RenderPosition.BEFOREEND);
  for (let i = 0; i < events.length; i++) {
    renderEvent(events[i]);
  }
} else {
  render(tripEventsElement, new NoEventsView(), RenderPosition.BEFOREEND);
}

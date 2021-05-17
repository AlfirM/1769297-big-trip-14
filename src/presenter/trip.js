import { render, RenderPosition, remove } from '../utils/render.js';

import InfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import SortingView from '../view/sorting.js';
import NoEventsView from '../view/no-event-view.js';
import EventPresenter from './event.js';
import EventNewPresenter from './event-new.js';
import { sortByTime, sortByPrice } from '../utils/event.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { filter } from '../utils/filter.js';

export default class TripPresenter {
  constructor(tripEventsContainer, tripEventListContainer,  tripInfoContainer, eventsModel, filterModel) {
    this._tripEventsContainer = tripEventsContainer;
    this._tripInfoContainer = tripInfoContainer;
    this._tripEventListContainer = tripEventListContainer;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._eventPresenter = {};
    this._currentSortType = SortType.DAY;

    this._noEventsComponent = new NoEventsView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._eventNewPresenter = new EventNewPresenter(this._tripEventListContainer, this._handleViewAction);
  }

  init() {
    this._renderTrip();
  }

  createEvent() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init();
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredEvents.sort(sortByTime);
      case SortType.PRICE:
        return filteredEvents.sort(sortByPrice);
    }
    return filteredEvents;
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _renderTripInfo(events) {
    this._tripInfoComponent = new InfoView(events);
    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCostInfo(events) {
    this._costInfoComponent = new TripCostView(events);
    render(this._tripInfoComponent, this._costInfoComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortingView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripEventListContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._tripEventListContainer, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents(events) {
    events.slice().forEach((item) => this._renderEvent(item));
  }

  _renderNoEvents() {
    render(this._tripEventsContainer, this._noEventsComponent , RenderPosition.BEFOREEND);
  }

  _destroyTripBoard({ resetSortType = false } = {}) {
    this._eventNewPresenter.destroy();
    Object.values(this._eventPresenter).forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    remove(this._sortComponent);
    remove(this._noEventsComponent);
    remove(this._costInfoComponent);
    remove(this._tripInfoComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }


  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this.eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._destroyTripBoard();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._destroyTripBoard({ resetSortType: true });
        this._renderTrip();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._destroyTripBoard();
    this._renderTrip();
  }

  hideEventsTable() {
    this._tripEventsContainer.classList.add('trip-events--hidden');
  }

  showEventsTable() {
    this._tripEventsContainer.classList.remove('trip-events--hidden');
    this._handleSortTypeChange(SortType.DAY);
  }

  _renderTrip() {
    const events = this._getEvents();
    if (events.length > 0) {
      this._renderTripInfo(events);
      this._renderCostInfo(events);
      this._renderSort();
      this._renderEvents(events);
      return;
    }

    this._renderNoEvents();

  }
}

import { render, RenderPosition } from '../utils/render.js';
import {updateItem} from '../utils/common.js';

import InfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import SortingView from '../view/sorting.js';
import NoEventsView from '../view/no_event_view.js';
import EventPresenter from './event.js';
import { sortByTime, sortByPrice } from '../utils/event.js';
import { SortType } from '../const.js';

export default class TripPresenter {
  constructor(tripEventsContainer, tripEventListContainer,  tripInfoContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._tripInfoContainer = tripInfoContainer;
    this._tripEventListContainer = tripEventListContainer;
    this._eventPresenter = {};
    this._currentSortType = SortType.DAY;

    this._sortComponent = new SortingView();
    this._noEventsComponent = new NoEventsView();

    this._handleAddToFavorites = this._handleAddToFavorites.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._sourcedBoardEvents = events.slice();
    this._tripInfoComponent = new InfoView(this._events);
    this._costInfoComponent = new TripCostView(this._events);
    this._renderTrip();
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleAddToFavorites(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._sourcedBoardEvents = updateItem(this._sourcedBoardEvents, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _renderTripInfo() {
    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCostInfo() {
    render(this._tripInfoComponent, this._costInfoComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._tripEventListContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._tripEventListContainer, this._handleAddToFavorites, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents() {
    this._events.slice().forEach((item) => this._renderEvent(item));
  }

  _renderNoEvents() {
    render(this._tripEventsContainer, this._noEventsComponent , RenderPosition.BEFOREEND);
  }

  _clearEvents() {
    Object.values(this._eventPresenter).forEach((item) => item.destroy());
    this._eventPresenter = {};
  }


  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._events.sort(sortByTime);
        break;
      case SortType.PRICE:
        this._events.sort(sortByPrice);
        break;
      default:
        this._events = this._sourcedBoardEvents.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortEvents(sortType);
    this._clearEvents();
    this._renderEvents();
  }

  _renderTrip() {
    if (this._events.length > 0) {
      this._renderTripInfo();
      this._renderCostInfo();
      this._renderSort();
      this._renderEvents();
    } else {
      this._renderNoEvents();
    }
  }
}

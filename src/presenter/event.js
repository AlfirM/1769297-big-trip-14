import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import { render, replace, RenderPosition, remove } from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';

const ESCAPE_BUTTON_KEY = 'Escape';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Event {
  constructor(eventsList, changeData, changeMode, offers, destinations) {
    this._eventsList = eventsList;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._offers = offers;
    this._destinations = destinations;

    this._eventComponent = null;
    this._editEventComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEventOpenButtonClick = this._handleEventOpenButtonClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleEventCloseButtonClick = this._handleEventCloseButtonClick.bind(this);
    this._handleDeleteButtonClick = this._handleDeleteButtonClick.bind(this);
    this._handleEditFormSubmit = this._handleEditFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEditEventComponent = this._editEventComponent;

    this._eventComponent = new EventView(event);
    this._editEventComponent = new EventEditView(event, this._offers, this._destinations);
    render(this._eventsList, this._eventComponent, RenderPosition.BEFOREEND);

    this._eventComponent.setEditClickHandler(this._handleEventOpenButtonClick);
    this._eventComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editEventComponent.setClickHandler(this._handleEventCloseButtonClick);
    this._editEventComponent.setFormSubmitHandler(this._handleEditFormSubmit);
    this._editEventComponent.setDeleteClickHandler(this._handleDeleteButtonClick);

    if (prevEventComponent === null || prevEditEventComponent === null) {
      render(this._eventsList, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editEventComponent, prevEditEventComponent);
    }

    remove(prevEventComponent);
    remove(prevEditEventComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._editEventComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToForm() {
    replace(this._editEventComponent, this._eventComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._eventComponent, this._editEventComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === ESCAPE_BUTTON_KEY) {
      evt.preventDefault();
      this._handleEventCloseButtonClick();
    }
  }

  _handleEventOpenButtonClick() {
    this._replaceCardToForm();
  }

  _handleEventCloseButtonClick() {
    this._editEventComponent.reset(this._event);
    this._replaceFormToCard();
  }

  _handleEditFormSubmit(event) {
    this._changeData(UserAction.UPDATE_EVENT, UpdateType.MINOR, event);
    this._replaceFormToCard();
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      Object.assign({}, this._event, { isFavorite: !this._event.isFavorite }),
    );
  }

  _handleDeleteButtonClick(event) {
    this._changeData(UserAction.DELETE_EVENT, UpdateType.MINOR, event);
  }
}

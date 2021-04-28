import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import { render, replace, RenderPosition, remove } from '../utils/render.js';

const ESCAPE_BUTTON_KEY = 'Escape';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Event {
  constructor(eventsList, changeData, changeMode) {
    this._eventsList = eventsList;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._editEventComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEventOpenClick = this._handleEventOpenClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleEventCloseClick = this._handleEventCloseClick.bind(this);
    this._handleEditFormSubmit = this._handleEditFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEditEventComponent = this._editEventComponent;

    this._eventComponent = new EventView(event);
    this._editEventComponent = new EventEditView(event);

    render(this._eventsList, this._eventComponent, RenderPosition.BEFOREEND);

    this._eventComponent.setEditClickHandler(this._handleEventOpenClick);
    this._eventComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editEventComponent.setClickHandler(this._handleEventCloseClick);
    this._editEventComponent.setFormSubmitHandler(this._handleEditFormSubmit);

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
      this._replaceFormToCard();
    }
  }

  _handleEventOpenClick() {
    this._replaceCardToForm();
  }

  _handleEventCloseClick() {
    this._replaceFormToCard();
  }

  _handleEditFormSubmit() {
    this._replaceFormToCard();
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._event,
        {
          isFavorite: !this._event.isFavorite,
        },
      ),
    );
  }
}

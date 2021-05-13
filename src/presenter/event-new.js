import EventEditView from '../view/event-edit.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';
import {nanoid} from 'nanoid';

const ESCAPE_BUTTON_KEY = 'Escape';

export default class Event {
  constructor(eventsList, changeData) {
    this._eventsList = eventsList;
    this._changeData = changeData;

    this._editEventComponent = null;

    this._handleEventCloseButtonClick = this._handleEventCloseButtonClick.bind(this);
    this._handleDeleteButtonClick = this._handleDeleteButtonClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    this._editEventComponent = new EventEditView();

    render(this._eventsList, this._editEventComponent, RenderPosition.AFTERBEGIN);

    this._editEventComponent.setClickHandler(this._handleEventCloseButtonClick);
    this._editEventComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editEventComponent.setDeleteClickHandler(this._handleDeleteButtonClick);
  }

  destroy() {
    if (this._editEventComponent === null) {
      return;
    }
    remove(this._editEventComponent);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === ESCAPE_BUTTON_KEY) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleFormSubmit(event) {
    this._changeData(UserAction.ADD_EVENT, UpdateType.MINOR, Object.assign({ id: nanoid()}, event));
    this.destroy();
  }

  _handleDeleteButtonClick() {
    this.destroy();
  }

  _handleEventCloseButtonClick() {
    this.destroy();
  }
}

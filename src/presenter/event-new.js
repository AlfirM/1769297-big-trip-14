import EventEditView from '../view/event-edit.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';

const ESCAPE_BUTTON_KEY = 'Escape';

export default class Event {
  constructor(eventsList, changeData, offers, destinations) {
    this._eventsList = eventsList;
    this._changeData = changeData;
    this._offers = offers;
    this._destinations = destinations;
    this._editEventComponent = null;

    this._handleEventCloseButtonClick = this._handleEventCloseButtonClick.bind(this);
    this._handleDeleteButtonClick = this._handleDeleteButtonClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    this._editEventComponent = new EventEditView(this._event, this._offers, this._destinations);

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
    this._changeData(UserAction.ADD_EVENT, UpdateType.MINOR, event);
    this.destroy();
  }

  _handleDeleteButtonClick() {
    this.destroy();
  }

  _handleEventCloseButtonClick() {
    this.destroy();
  }

  setSaving() {
    this._editEventComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._editEventComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._editEventComponent.shake(resetFormState);
  }
}

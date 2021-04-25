import Abstract from '../view/abstract.js';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, child, place = RenderPosition.BEFOREEND) => {
  let destinationContainer = '';

  if (container instanceof Abstract) {
    destinationContainer = container.getElement();
  } else {
    destinationContainer = container;
  }

  let insertedElement = '';

  if (child instanceof Abstract) {
    insertedElement = child.getElement();
  } else {
    insertedElement = child;
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      destinationContainer.prepend(insertedElement);
      break;
    case RenderPosition.BEFOREEND:
      destinationContainer.append(insertedElement);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const replace = (oldChild, newChild) => {
  
  let oldElement = '';

  if (oldChild instanceof Abstract) {
    oldElement = oldChild.getElement();
  } else {
    oldElement = oldChild;
  }

  let newElement = '';

  if (newChild instanceof Abstract) {
    newElement = newChild.getElement();
  } else {
    newElement = newChild;
  }

  const parent = newElement.parentElement;

  if (parent === null || oldElement === null || newElement === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(oldElement, newElement);
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

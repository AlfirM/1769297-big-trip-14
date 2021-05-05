import Abstract from '../view/abstract.js';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, child, place = RenderPosition.BEFOREEND) => {

  const destinationContainer = container instanceof Abstract ? container.getElement() : container;

  const insertedElement = child instanceof Abstract ? child.getElement() : child;

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

  const oldElement = oldChild instanceof Abstract ? oldChild.getElement() : oldChild;

  const newElement = newChild instanceof Abstract ? newChild.getElement() : newChild;

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

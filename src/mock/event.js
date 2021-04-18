import dayjs from 'dayjs';
import {getRandomInteger, getRandomItem, getDuration} from '../utils/common.js';
import {TYPES, CITIES} from '../const.js';

const Costs = {
  MIN_VALUE: 10,
  MAX_VALUE: 1000,
};

const Lengths = {
  MIN_DESCRIPTION_LENGTH: 1,
  MAX_DESCRIPTION_LENGTH: 5,
  MIN_PHOTOS_LENGTH: 1,
  MAX_PHOTOS_LENGTH: 3,
  MIN_OFFER: 1,
  MAX_OFFER: 5,
};

const Gaps = {
  MAX_DAY_GAP: 5,
  MIN_TIME_GAP: 30,
  MAX_TIME_GAP: 3000,
};

let index = 1;

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const EVENT_OFFERS = [
  {
    name: 'luggage',
    title: 'Add luggage',
    price: 50,
  },
  {
    name: 'comfort',
    title: 'Switch to comfort class',
    price: 80,
  },
  {
    name: 'train',
    title: 'Travel by train',
    price: 40,
  },
  {
    name: 'rent',
    title: 'Rent a car',
    price: 200,
  },
  {
    name: 'breakfast',
    title: 'Add breakfast',
    price: 50,
  },
  {
    name: 'lunch',
    title: 'Lunch in city',
    price: 30,
  },
];

const getRandomPhoto = () => {
  return `http://picsum.photos/248/152?r=${Math.random()}`;
};

const getPhotos = () => {
  return new Array(getRandomInteger(Lengths.MIN_PHOTOS_LENGTH, Lengths.MAX_PHOTOS_LENGTH)).fill().map(() => getRandomPhoto());
};

const getId = () => {
  index++;
  return index;
};

const generateEvent = () => {
  const timeStart = dayjs().add(getRandomInteger(-Gaps.MAX_DAY_GAP, Gaps.MAX_DAY_GAP), 'day');
  const timeEnd = dayjs(timeStart).add(getRandomInteger(Gaps.MIN_TIME_GAP, Gaps.MAX_TIME_GAP), 'minutes');
  return {
    id: getId(),
    type: getRandomItem(TYPES),
    timeStart,
    timeEnd,
    cost: getRandomInteger(Costs.MIN_VALUE, Costs.MAX_VALUE),
    offers: EVENT_OFFERS.length !== 0 ? new Array(getRandomInteger(Lengths.MIN_OFFER, Lengths.MAX_OFFER)).fill().map(() => getRandomItem(EVENT_OFFERS)) : [],
    duration: getDuration(timeStart, timeEnd),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    destination: {
      city: getRandomItem(CITIES),
      description: DESCRIPTIONS.length !== 0 ? new Array(getRandomInteger(Lengths.MIN_DESCRIPTION_LENGTH, Lengths.MAX_DESCRIPTION_LENGTH)).fill().map(() => getRandomItem(DESCRIPTIONS)) : [],
      photos: getPhotos(),
    },
  };
};

export {
  generateEvent
};

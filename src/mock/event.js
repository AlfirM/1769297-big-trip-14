import dayjs from 'dayjs';
import {getRandomInteger, getRandomItem, getDuration} from '../utils.js';
import {TYPES, CITIES} from '../const.js';

const MIN_COST = 10;
const MAX_COST = 1000;
const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 5;
const MAX_DAY_GAP = 5;
const MIN_TIME_GAP = 30;
const MAX_TIME_GAP = 3000;

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

const eventOffers = [
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
    title: 'ALunch in city',
    price: 30,
  },
];

const MIN_PHOTOS_LENGTH = 1;
const MAX_PHOTOS_LENGTH = 3;

const getRandomPhoto = () => {
  return `http://picsum.photos/248/152?r=${Math.random()}`;
};

const getPhotos = () => {
  return new Array(getRandomInteger(MIN_PHOTOS_LENGTH, MAX_PHOTOS_LENGTH)).fill().map(() => getRandomPhoto());
};

const getId = () => {
  let index = 1;
  index += 1;  
  return index;
};

const generateOffers = () => {
  const randomCount = getRandomInteger(0, eventOffers.length - 1);
    
  const offers = [];

  if(eventOffers.length === 0)
  {
    return offers;
  }

  const randomOffer = eventOffers[0];

  for (let i = 0; i < randomCount; i++) {
    randomOffer = eventOffers[getRandomInteger(0, eventOffers.length - 1)];
    if(offers.indexOf(randomOffer) == -1)
    {
      offers.push(randomOffer);
    }
  }  

  return offers;
};


const generateEvent = () => {
  const timeStart = dayjs().add(getRandomInteger(-MAX_DAY_GAP, MAX_DAY_GAP), 'day');
  const timeEnd = dayjs(timeStart).add(getRandomInteger(MIN_TIME_GAP, MAX_TIME_GAP), 'minutes');
  return {
    id: getId(),
    type: getRandomItem(TYPES),
    timeStart,
    timeEnd,
    cost: getRandomInteger(MIN_COST, MAX_COST),
    offers: generateOffers(),
    duration: getDuration(timeStart, timeEnd),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    destination: {
      city: getRandomItem(CITIES),
      description: DESCRIPTIONS.length !== 0 ? new Array(getRandomInteger(MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH)).fill().map(() => getRandomItem(DESCRIPTIONS)) : [],
      photos: getPhotos(),
    },
  };
};

export {
  generateEvent
};

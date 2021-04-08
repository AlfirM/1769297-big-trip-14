import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomItem = (ITEMS) => {
  const randomIndex = getRandomInteger(0, ITEMS.length - 1);

  return ITEMS[randomIndex];
};

export const getDuration = (timeStart, timeEnd) =>
{
  const duration = dayjs(timeEnd).diff(dayjs(timeStart), 'm');

  const hours = Math.floor(duration / 60) % 24;

  const days = Math.floor(duration / 1440);

  const minutes = duration % 60;

  if (days === 0 && hours === 0 && minutes > 0) {
    return minutes + 'M';

  }else if (days === 0 && hours > 0) {
    return hours + 'H ' + minutes + 'M';

  }else if (days > 0) {
    return days + 'D ' + hours + 'H ' + minutes + 'M';
  }
};

export const createOfferMarkup = (offers) => {
  return offers
    .map((item) => {
      return `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="${item.title}" type="checkbox" name="event-offer-${item.title}">
          <label class="event__offer-label" for="${item.title}">
            <span class="event__offer-title">${item.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${item.price}</span>
          </label>
        </div>
        `;
    })
    .join(' ');
};

export const humanizeDate = (dueDate, format) => {
  return dayjs(dueDate).format(format);
};

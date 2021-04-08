const createTripInfoTemplate = (events) => {
  let cities = '';

  if (events.length > 3) {
    cities = events[0].destination.city + ' &mdash; ... &mdash; ' + events[events.length - 1].destination.city;
  }
  else
  {
    cities = events.reduce((total, current) => total + ' &mdash; ' + current.city);
  }

  return `<section class="trip-main__trip-info  trip-info">
              <div class="trip-info__main">
                <h1 class="trip-info__title">${cities}</h1>
                <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
              </div>
            </section>`;
};

export { createTripInfoTemplate };

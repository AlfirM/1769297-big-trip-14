import Chart from 'chart.js';
import ChartDataTypes from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import { formatDuration} from '../utils/common';
import SmartView from './smart.js';


const createStatisticsTemplate = () => {

  return `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>
    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>
    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>
    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>;`;
};

const getTypes = (events) => {
  const types = events.map((event) => event.type);
  const uniqTypes = [...new Set(types)];
  return uniqTypes;
};

const getSumCostOfTypes = (events) => {
  const uniqueTypes = getTypes(events);

  const typeCostData = uniqueTypes.map((type) => {
    const price = _getEvents(events, type).reduce((typeCost, event) => typeCost + event.cost, 0);

    return {type, price};
  });

  const sortedData = typeCostData.sort((a, b) => b.price - a.price);

  const types = sortedData.map((item) => item.type);
  const prices = sortedData.map((item) => item.price);

  return {types, prices};
};

const getCountsOfTypes = (events) => {
  const uniqueTypes = getTypes(events);

  const typeCountData = uniqueTypes.map((type) => {
    const typeCount = _getEvents(events, type).length;
    return {type, typeCount};
  });

  const sortedData = typeCountData.sort((a, b) => b.typeCount - a.typeCount);

  const types = sortedData.map((item) => item.type);
  const counts = sortedData.map((item) => item.typeCount);

  return {types, counts};
};

const getDurationsOfTypes = (events) => {
  const uniqueTypes = getTypes(events);

  const typeDurationData = uniqueTypes.map((type) => {
    const duration = _getEvents(events, type).reduce((duration, event) => duration + dayjs(event.timeEnd).diff(dayjs(event.timeStart), 'm'), 0);
    return {type, duration};
  });

  const sortedData = typeDurationData.sort((a, b) => b.duration - a.duration);

  const types = sortedData.map((item) => item.type);
  const durations = sortedData.map((item) => item.duration);

  return {types, durations};
};

const _getEvents = (events, type) => {
  return events.filter((event) => event.type.toUpperCase() === type.toUpperCase());
};

const createMoneyChart = (moneyCtx, events) => {
  const data = getSumCostOfTypes(events);
  return new Chart(moneyCtx, {
    plugins: [ChartDataTypes],
    type: 'horizontalBar',
    data: {
      labels: data.types,
      datasets: [{
        data: data.prices,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createTypeChart = (typeCtx, events) => {
  const data = getCountsOfTypes(events);

  return new Chart(typeCtx, {
    plugins: [ChartDataTypes],
    type: 'horizontalBar',
    data: {
      labels: data.types,
      datasets: [{
        data: data.counts,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createDurationChart = (durationCtx, events) => {
  const data = getDurationsOfTypes(events);

  return new Chart(durationCtx, {
    plugins: [ChartDataTypes],
    type: 'horizontalBar',
    data: {
      labels: data.types,
      datasets: [{
        data: data.durations,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${formatDuration(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

export default class Statistics extends SmartView {
  constructor(events) {
    super();

    this._events = events;
    this._moneyChart = null;
    this._typeChart = null;
    this._durationChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._durationChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._durationChart = null;
    }

    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const durationCtx = this.getElement().querySelector('.statistics__chart--time');

    this._moneyChart = createMoneyChart(moneyCtx, this._events);
    this._typeChart = createTypeChart(typeCtx, this._events);
    this._durationChart = createDurationChart(durationCtx, this._events);
  }
}

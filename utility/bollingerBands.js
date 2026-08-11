const { BOLLINGER_PERIOD, STD_DEV_MULTIPLIER } = require('../config/constants');

function sma(vals) {
  let total = 0;
  for (let i = 0; i < vals.length; i++) {
    total += vals[i];
  }
  return total / vals.length;
}

function stdDev(vals, avg) {
  let sumSq = 0;
  for (let i = 0; i < vals.length; i++) {
    const diff = vals[i] - avg;
    sumSq += diff * diff;
  }
  const variance = sumSq / vals.length;
  return Math.sqrt(variance);
}

function getBollingerBands(closePrices, period = BOLLINGER_PERIOD, k = STD_DEV_MULTIPLIER) {
  const result = new Array(closePrices.length).fill(null);

  for (let i = period - 1; i < closePrices.length; i++) {
    const win = closePrices.slice(i - period + 1, i + 1);
    const mid = sma(win);
    const sd = stdDev(win, mid);

    const upper = mid + (k * sd);
    const lower = mid - (k * sd);

    result[i] = { middle: mid, upper: upper, lower: lower };
  }

  return result;
}

module.exports = { sma, stdDev, getBollingerBands };

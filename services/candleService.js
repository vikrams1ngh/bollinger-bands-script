const moment = require('moment');
const upstoxClient = require('../clients/upstoxClient');
const candleRepository = require('../db/candleRepository');
const log = require('../logger/logger');
const { CANDLE_INTERVAL } = require('../config/constants');

// upstox gives back [timestamp, open, high, low, close, volume, oi] newest first
function toCandle(row) {
  return {
    timestamp: row[0],
    open: row[1],
    high: row[2],
    low: row[3],
    close: row[4],
    volume: row[5],
  };
}

async function getCandles(instrumentKey, from, to) {
  const fromDate = from.format('YYYY-MM-DD');
  const toDate = to.format('YYYY-MM-DD');

  // as today market is not closed so we need to avoid today data from caching
  const includesToday = to.isSameOrAfter(moment(), 'day');

  if (!includesToday) {
    const cached = await candleRepository.find(instrumentKey, fromDate, toDate);
    if (cached) {
      log.info(`using cach candles, ${instrumentKey} ${fromDate} - ${toDate}`)
      return cached;
    }
  }

  //fetching from upstox api historical data 
  const res = await upstoxClient.fetchHistoricalCandles({
    instrumentKey,
    interval: CANDLE_INTERVAL,
    fromDate,
    toDate,
  });

  const rows = res.data.candles

  // need to reverse becayes upstox return new data first
  const candles = rows.map(toCandle).reverse();

  if (!includesToday) {
    await candleRepository.save(instrumentKey, fromDate, toDate, candles);
  }

  return candles;
}

module.exports = { getCandles };

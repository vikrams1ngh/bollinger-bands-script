require('dotenv').config()

const { parseArgs } = require('./cli/argsParser');
const instrumentService = require('./services/instrumentService');
const candleService = require('./services/candleService')
const candleRepository = require('./db/candleRepository');
const { getBollingerBands } = require('./utility/bollingerBands');
const { findTouches } = require('./utility/touchDetector');
const log = require('./logger/logger');

async function main() {

  const { symbol, from, to } = parseArgs(process.argv.slice(2));

  log.info(`starting analysis for ${symbol}, ${from.format('DD-MM-YYYY')} to ${to.format('DD-MM-YYYY')}`)

  const instrumentKey = await instrumentService.resolveInstrumentKey(symbol);

  const candleData = await candleService.getCandles(instrumentKey, from, to);


  const closePrices = candleData.map((c) => c.close);
  const bands = getBollingerBands(closePrices);

  const hits = findTouches(candleData, bands);

  if (hits.length === 0) {
    log.info('no touches found in this range');
    return;
  }

  for (const h of hits) {
    const dateStr = new Date(h.timestamp).toLocaleString();
    const label = h.type === 'upper' ? 'upper band touched':'lower band touched'
    log.info(`${label} - ${dateStr} - close:${h.close.toFixed(2)},band: ${h.band[h.type].toFixed(2)}`);
  }
}

(async () => {
  try {
    await main();
  } catch (err) {
    log.error(`${err.name}: ${err.message}`);
    process.exitCode = 1;
  } finally {
    await instrumentService.closeRedisConnection();
    await candleRepository.close();
  }
})();

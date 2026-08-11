
function findTouches(candles, bands) {
  const hits = [];

  for (let i = 0; i < candles.length; i++) {
    const currentBand = bands[i];
    if (!currentBand) continue;

    const closePrice = candles[i].close;

    if (closePrice >= currentBand.upper) {
      hits.push({ index: i, timestamp: candles[i].timestamp, close: closePrice, band: currentBand, type: 'upper' });
    } else if (closePrice <= currentBand.lower) {
      hits.push({ index: i, timestamp: candles[i].timestamp, close: closePrice, band: currentBand, type: 'lower' });
    }
  }

  return hits;
}

module.exports = { findTouches };

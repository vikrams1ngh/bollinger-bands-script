const zlib = require('zlib');
const { UPSTOX_BASE_URL, UPSTOX_INSTRUMENTS_URL, UPSTOX_ACCESS_TOKEN } = require('../config/constants');
const { UpstockApiError } = require('../errors/customErrors');

async function callUpstox(url, headers) {
  let res;

  try {
    res = await fetch(url, { headers: headers || {} });
    } catch (err) {
    throw new UpstockApiError(`couldnt reach upstox - ${err.message}`);
  }

  if (!res.ok) {
    throw new UpstockApiError(`Upstox request failed (${res.status} ${res.statusText}) for ${url}`);
  }

  return res;
}

async function getInstrumentsFile() {
  const res = await callUpstox(UPSTOX_INSTRUMENTS_URL);
  const gzipped = Buffer.from(await res.arrayBuffer());
  const json = zlib.gunzipSync(gzipped).toString('utf-8')
  return JSON.parse(json);
}

async function getCandles({ instrumentKey, interval, fromDate, toDate, accessToken = UPSTOX_ACCESS_TOKEN }) {
  if (!accessToken) {
    throw new UpstockApiError('No access token found, set environment variable UPSTOX_ACCESS_TOKEN');
  }
  const url = `${UPSTOX_BASE_URL}/historical-candle/${encodeURIComponent(instrumentKey)}/${interval}/${toDate}/${fromDate}`;

  const res = await callUpstox(url, { Authorization: `Bearer ${accessToken}` });

  return res.json();
}

module.exports = { fetchInstruments: getInstrumentsFile, fetchHistoricalCandles: getCandles };



const BOLLINGER_PERIOD = 20;
const STD_DEV_MULTIPLIER = 2;


const UPSTOX_BASE_URL = 'https://api.upstox.com/v2';
const UPSTOX_INSTRUMENTS_URL = 'https://assets.upstox.com/market-quote/instruments/exchange/complete.json.gz';
const CANDLE_INTERVAL = '1minute';

const NSE_EQUITY_SEGMENT = 'NSE_EQ';

const DATE_FORMAT = 'DD-MM-YYYY';


const INSTRUMENTS_CACHE_TTL_SECONDS = 24 * 60 * 60;
const INSTRUMENTS_CACHE_KEY = 'upstox:instruments:NSE_EQ';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const MONGO_URL = process.env.MONGO_URL || 'mongodb://admin:changeme@localhost:27017';
const MONGO_DB_NAME = 'bollinger_bands';

const UPSTOX_ACCESS_TOKEN = process.env.UPSTOX_ACCESS_TOKEN;

module.exports = {
  UPSTOX_BASE_URL,
  UPSTOX_INSTRUMENTS_URL,
  UPSTOX_ACCESS_TOKEN,
  CANDLE_INTERVAL,
  NSE_EQUITY_SEGMENT,
  DATE_FORMAT,
  BOLLINGER_PERIOD,
  STD_DEV_MULTIPLIER,
  INSTRUMENTS_CACHE_KEY,
  INSTRUMENTS_CACHE_TTL_SECONDS,
  REDIS_URL,
  MONGO_URL,
  MONGO_DB_NAME,
};

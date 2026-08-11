const { createClient } = require('redis');
const upstoxClient = require('../clients/upstoxClient');
const { SymbolNotFoundError } = require('../errors/customErrors');
const {
  NSE_EQUITY_SEGMENT,
  INSTRUMENTS_CACHE_KEY,
  INSTRUMENTS_CACHE_TTL_SECONDS,
  REDIS_URL,
} = require('../config/constants');

let redisClient;

async function initRedis() {
  if (redisClient) return redisClient;

  redisClient = createClient({ url: REDIS_URL });
    redisClient.on('error', (err) => console.error('Redis error:', err.message));
  await redisClient.connect();

  return redisClient;
}

async function loadInstruments() {
  const redis = await initRedis();
  const cached = await redis.get(INSTRUMENTS_CACHE_KEY);

  if (cached) return JSON.parse(cached);

  const all = await upstoxClient.fetchInstruments();
  const equities = all.filter((row) => row.segment === NSE_EQUITY_SEGMENT);

  await redis.set(INSTRUMENTS_CACHE_KEY, JSON.stringify(equities), { EX: INSTRUMENTS_CACHE_TTL_SECONDS });

  return equities;
}

async function resolveInstrumentKey(symbol) {
  const target = symbol.trim().toUpperCase();
  const instruments = await loadInstruments();
  const match = instruments.find((row) => row.trading_symbol === target);

  if (!match) {
    throw new SymbolNotFoundError(`Could not find a ${NSE_EQUITY_SEGMENT} instrument for symbol "${target}"`);
  }

  return match.instrument_key;
}

async function closeRedisConnection() {
  if (!redisClient) return;
  await redisClient.quit()
  redisClient = undefined;
}

module.exports = { resolveInstrumentKey, closeRedisConnection };

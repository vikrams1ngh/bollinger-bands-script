const { MongoClient } = require('mongodb');
const { MONGO_URL, MONGO_DB_NAME } = require('../config/constants');

let client;
let collection;

async function connectDb() {
  if (collection) return collection;

  client = new MongoClient(MONGO_URL);
    await client.connect();

  collection = client.db(MONGO_DB_NAME).collection('candles');
  await collection.createIndex({ instrumentKey: 1, fromDate: 1, toDate: 1 }, { unique: true });

  return collection;
}

async function find(instrumentKey, fromDate, toDate) {
  const col = await connectDb();
  const doc = await col.findOne({ instrumentKey, fromDate, toDate })
  return doc ? doc.candles : null;
}

async function save(instrumentKey, fromDate, toDate, candles) {
  const col = await connectDb();
  await col.updateOne(
    { instrumentKey, fromDate, toDate },
    { $set: { instrumentKey, fromDate, toDate, candles, cachedAt: new Date() } },
    { upsert: true },
  );
}

async function close() {
  if (!client) return;
  await client.close();
  client = undefined;
  collection = undefined;
}

module.exports = { find, save, close };

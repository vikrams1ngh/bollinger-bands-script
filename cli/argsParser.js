const moment = require('moment');
const {InvalidArgumentError, InvalidDateRangeError} = require('../errors/customErrors')
const { DATE_FORMAT } = require('../config/constants');

function parseDate(value, flagName) {
  const d = moment(value, DATE_FORMAT, true);
  if (!d.isValid()) {
    throw new InvalidArgumentError(`${flagName} must be a real date in DD-MM-YYYY format, got "${value}"`);
  }
  return d;
}

// creating json object from arguements passed in command line
function toRawObject(argv) {
  const raw = {};

  for (const token of argv) {
    if (!token.startsWith('--')) continue;

    const eqlIndex = token.indexOf('=');
    if (eqlIndex === -1) {
      throw new InvalidArgumentError(`Expected --flag=value but got "${token}"`);
    }

    const key = token.slice(2, eqlIndex);
    const value = token.slice(eqlIndex + 1);
    raw[key] = value;
  }

  return raw;
}

function parseArgs(argv) {
  const raw = toRawObject(argv);

  if (!raw.symbol) throw new InvalidArgumentError('symbol is required, example --symbol=INFY');
  if (!raw.from) throw new InvalidArgumentError('from is required, example --from=01-07-2025');
  if (!raw.to) throw new InvalidArgumentError('to is required, example --to=31-07-2025');

  const symbol = raw.symbol.trim().toUpperCase();
  if (!symbol) throw new InvalidArgumentError('--symbol cannot be empty');

  const from = parseDate(raw.from, '--from');
  const to = parseDate(raw.to, '--to');

  if (from.isAfter(to)) {
    throw new InvalidDateRangeError(`--from (${raw.from}) must not be after --to (${raw.to})`);
  }

  return { symbol, from, to };
}

module.exports = { parseArgs };

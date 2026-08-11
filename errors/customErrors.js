class InvalidArgumentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidArgumentError';
  } 
}

class InvalidDateRangeError extends Error { 
    constructor(message) {
        super(message);
        this.name = 'InvalidDateRangeError';
    }
}

class SymbolNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SymbolNotFoundError';
    }
}

class CandleDataNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CandleDataNotFoundError';
    }
}

class UpstockApiError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UpstockApiError';
    }
}


module.exports = {
  InvalidArgumentError,
  InvalidDateRangeError,
  SymbolNotFoundError,
  CandleDataNotFoundError,
  UpstockApiError,
};
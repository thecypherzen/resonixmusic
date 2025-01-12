/** global constant values
 *
 * The following default values are defined:
 *
 * => AUDIO_CHUNK_SIZE: the default size (in bytes) of an
 *    audio file's chunk.
 * => CACHE_EXP_SECS: expiry time (in seconds) for cached values.
 */

const APP = 'ResonixMusic';
const RESPONSE_CODES = {
  0: {
    code: 0,
    type: 'Success',
    des: 'Success (or success with warning)',
  },
  1: {
    code: 1,
    type: 'Exception',
    des: 'A generic not well identificated error occurred',
  },
  2: {
    code: 2,
    des: 'The received http method is not supported for this method',
    type: 'Http Method',
  },
  3: {
    code: 3,
    des: 'One of the received parameters has a value not respecting requirements such as type, range, format, etc',
    type: 'Type',
  },
  4: {
    code: 4,
    des: 'A required parameter was not been received, or it was empty',
    type: 'Required Parameter',
  },
  5: {
    code: 5,
    des: 'The client Id received does not exists or cannot be validated ',
    type: 'Invalid Client Id',
  },
  6: {},
  7: {},
  8: {},
  9: {},
  10: {},
  11: {},
  12: {},
  13: {},
  14: {},
  15: {},
  16: {},
  17: {},
  18: {},
  19: {},
  20: {},
  21: {},
  22: {
    code: 22,
    des: 'Route is not supported',
    type: 'Invalid Route',
  }
};

const COLOURS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[33m',
  yellow: '\x1b[34m',
  normal: '\x1b[0m',
};

const STATUS_CODES = {
  ETIMEDOUT: {
    code: 408,
    message: `${APP} reequest timed out`,
  },
  ENETUNREACH: {
    code: 502,
    message: `${APP} was unable to connect. Check internet`,
  },
  ENOTFOUND: {
    code: 502,
    message: `${APP} could not resolve host`,
  },
  ECONNABORTED: {
    code: 408,
    message: `${APP} upstream server took too long to respond`,
  },
  ECONNREFUSED: {
    code: 503,
    message: `${APP} upstream server unavailable`,
  },
  ERR_NETWORK: {
    code: 500,
    message: `${APP} request client encountered or received an error while processing request`,
  },
  ERR_BAD_RESPONSE: {
    code: 502,
    message: `${APP} request client received a bad response`,
  },
  ERR_BAD_REQUEST: {
    code: 400,
    message: `${APP} request client received a bad request`,
  },
  EAI_AGAIN: {
    code: 503,
    message: `${APP} upstream server unavailable`,
  },
  ERR_FR_TOO_MANY_REDIRECTS: {
    code: 310,
    message: `Too many redirects were followed by ${APP} request client`,
  },
  ERR_DEPRECATED: {
    code: 400,
    message: `Requested function deprecated`,
  },
  ERR_INVALID_URL: {
    code: 400,
    message: `${APP} request client received a bad url`,
  },
  ERR_UNKNOWN: {
    code: 500,
    message: `${APP} request client encountered an error`,
  },
}

const APIS = { jamendo: 'jamendo' },
      AUDIO_CHUNK_SIZE = Math.ceil(2 ** 20),
      CACHE_EXP_SECS = 24 * 7 * 3600,
      JAMENDO = {
        id: process.env.JAM_CLIENT_ID,
        secret: process.env.JAM_CLIENT_SECRET,
        version: 'v3.0',
        base: 'https://api.jamendo.com',
        callbackUrl: null,
      },
      MIN_PAGE_SIZE = 20,
      MAX_PAGE_SIZE = 200,
      RXBE_PORT = process.env.RXBE_PORT || 5000,
      TIMEOUT = 500,
      MIN_RETRIES = 5,
      MAX_RETRIES = 10;

export {
  AUDIO_CHUNK_SIZE,
  CACHE_EXP_SECS,
  COLOURS,
  JAMENDO,
  MAX_PAGE_SIZE,
  MAX_RETRIES,
  MIN_PAGE_SIZE,
  MIN_RETRIES,
  RESPONSE_CODES,
  RXBE_PORT,
  STATUS_CODES,
  TIMEOUT,
};

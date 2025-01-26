// defines some reusable configurations
import axios from 'axios';
import qs from 'qs';
import {
  COLOURS,
  JAMENDO,
  MAX_RETRIES,
  PARAMS as paramsIndex,
  STATUS_CODES as statusCodes,
  TIMEOUT,
} from '../defaults/index.js';
import logger from './logMessage.js';

class RequestClientError extends Error {
  #name = 'RequestClientError';
  constructor(message, options = { }) {
    super(message);
    for (const[key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }

  get name(){
    return this.#name;
  }

  [Symbol.toStringTag] = this.#name;
  toString () {
    const details = {
      message: this.message || 'An error occured',
      code: this.code || 'UNKNOWN',
      errno: this?.errno ?? 500,
      stack: this?.stack ?? null,
    };
    return `${this[Symbol.toStringTag]} ${details}`;
  }
  toJSON() {
    return {
      'name': this.name,
      'message': this.message,
      'code': this?.code ?? 'UNKNOWN',
      'errno': this?.errno ?? 500,
      'stack': this?.stack ?? null,
    }
  }
}

class RequestClient {
  constructor() {
    this.client = axios.create({
      TIMEOUT,
      params: {
        client_id: JAMENDO.id,
      },
      paramsSerializer: (params) => {
        const encode = encodeURIComponent;
        return Object
          .entries(params)
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return `${encode(key)}=${encode(value.join('+'))}`;
            }
            return `${encode(key)}=${encode(value)}`;
          })
          .join('&');
      },
    });
    this.client.defaults.baseURL = null;
  }
  // private properties
  #name = 'RequestClient';
  #host = `${JAMENDO.base}/${JAMENDO.version}`;

  // getters
  get host() { return this.#host }
  get isReady(){
    return this.client.defaults.baseURL != null;
  }
  get name() {
    return this.#name;
  }
  // Public methods
  init() {
    this.client.defaults.baseURL = this.#host;
    if (this.isReady) {
      this.log({
        message: `[${this.name}] HostUrl set to ${this.host}`,
        type: 'success',
      });
    }
  }

  log({
    error = null,
    message = null,
    type = 'normal',
    req = null
  }) {
    logger.log({ error, message, type, req });
  }

  async make(config) {
    let count = 0;
    let errorObj = null;
    let timeStart,
        timeEnd;
    this.log({
      message: `[OUTGOING] ${this.host}${config.url}`
    });
    const makeRequest = async (config, delay) => {
      count += 1;
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const response = await this.client(config, delay);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    };

    timeStart = Date.now();
    while (count < MAX_RETRIES) {
      const delay = !count ? 0 : 1000;
      try {
        const response = await makeRequest(config, delay);
        timeEnd = Date.now();
        this.setTimeTaken(timeStart, timeEnd, response);
        return response;
      } catch (error) {
        console.log(error.message);
        errorObj = error;
        if (error?.response) {
          break;
        }
        this.log({
          message: `Request failed...retrying...[${count}]`,
          type: 'error'
        });
      }
    }
    timeEnd = Date.now();
    const msg = errorObj?.response?.status
          ? errorObj.message
          : (statusCodes[errorObj.code]?.message
             ?? 'An error occured');
    const errToThrow = new RequestClientError(
      msg,
      {
        errno: errorObj?.response?.status || errorObj.errno,
        code: errorObj?.code ?? null,
        stack: errorObj?.stack ?? null,
      }
    );
    if (errorObj?.response?.data) {
      const data = errorObj.response.data;
      for (const [key, value] of Object.entries(data)){
        errToThrow[key] = value;
      }
    }
    this.setTimeTaken(timeStart, timeEnd, errToThrow);
    throw errToThrow;
  }

  setDataHeaders (obj, { error = null, options = {} }) {
    const newHdrs = {
      status: 'success',
      code: 0,
      error_message: '',
      warnings: '',
      ...(obj?.headers ?? {}),
      ...options,
    };
    if (error) {
      try {
        newHdrs.status = 'failed';
        newHdrs.code = newHdrs.code || error.code;
        newHdrs.error_message = error.message;
        if (error.timeTaken){
          delete error.timeTaken;
        }
        newHdrs.error = error;
      } catch (err) {
        throw err;
      }
    }
    obj.headers = newHdrs;
    return null;
  }

  setResHeaders(resObj, headers) {
    for (const[key, value] of Object.entries(headers)) {
      resObj.set(key, value);
    }
  }

  // set query parameters in configuration
  setQueryParams (params, config) {
    for (let [param, value] of Object.entries(params)){
      if (paramsIndex[param]) {
        if (param === 'page') {
          const pg = parseInt(value);
          const sz = parseInt(params['page_size']);
          value = `${(pg - 1) * sz}`;
        }
        param = paramsIndex[param];
      }
      config.params[param] = value;
    }
  }

  // set response status code
  async setResStatus (code, res) {
    if (statusCodes[code]) {
      await res.status(statusCodes[code].code);
      return true;
    }
    return false;
  }

  // set time successful request took
  setTimeTaken(start, end, obj) {
    obj['timeTaken'] = `${(end - start) / 1000}ms`;
    return true;
  }

  // Symbols
  [Symbol.toStringTag] = this.#name;

  // Object overwrites
  toString() {
    return `[${this[Symbol.toStringTag]} `+
      `host: ${this.#host}, isReady: ${this.isReady}]`;
  }
}

const requestClient = new RequestClient();
requestClient.init();

export {
  RequestClient,
  RequestClientError,
  requestClient,
};


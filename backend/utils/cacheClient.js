import { createClient } from 'redis';
import {
  CACHE_EXP_SECS,
  RXCACHE_PORT as cachePort,
} from '../defaults/index.js';

import {
  RequestClientError,
} from '../utils/requestClient.js';

class CacheClient {
  #name = 'CacheClient';
  constructor() {
    this.client = null;
    this.isReady = false;
    this.clientEngine = createClient({
      socket: {
        host: 'localhost',
        port: cachePort,
      },
    }).on('error', (err) => {
      console.error(`${this.name} encountered an error: ${err}`);
    })
      .on('ready', () => {
        this.isReady = true;
        console.log(`${this.name} is ready using port ${cachePort}`);
      })
      .on('end', () => console.log(`${this.name} says goodbye...`))
      .connect()
      .then((client) => {
        this.client = client;
      });
    }

  get name() {
    return this.#name;
  }

  [Symbol.toStringTag] = this.#name;

  // get set del
  async get(key, buffers = true, format = 'binary') {
    const data = await this.client.get(key);
    return buffers && data ? Buffer.from(data, 'binary') : data;
  }

  async set(key, value, ex = CACHE_EXP_SECS) {
    const res = await this.client.set(key, value, 'EX', ex);
    return res;
  }

  async del(...keys) {
    const res = await this.client.del(...keys);
    return res;
  }

  // hget hset hsetmany hdel
  async hGet(hash, field, buffers = false, format = 'binary') {
    const data = await this.client.hGet(hash, field);
    return buffers && data ? Buffer.from(data,) : data;
  }

  async hSet(hash, field, value, ex = CACHE_EXP_SECS) {
    const res = await this.client.hSet(hash, field, value);
    const retVal = { res, expire: 0 };
    if (res && ex) {
      const exp = await this.client.expire(hash, ex);
      retVal.expire = exp;
    }
    return retVal;
  }

  async hSetMany(hash, obj) {
    const promises = [];
    for (const [field, value] of Object.entries(obj)) {
      promises.push(this.client.hSet(hash, field, value));
    }
    const results = await Promise.all(promises);
    return results;
  }

  async hDel(hash, ...fields) {
    const res = await this.client.hDel(hash, ...fields);
    return res;
  }
}

class CacheClientError extends RequestClientError {
  #name = 'CacheClientError';
  constructor(message, { errno = null, code = null, stack = null }){
    super(message, {errno, code, stack});
  }
  [Symbol.toStringTag] = this.#name;
}

function cacheClientReady(client) {
  return new Promise((resolve, reject) => {
    let count = 0;
    const checker = () => {
      setTimeout(() => {
        if (client.isReady) {
          resolve(null);
        } else {
          count += 1;
          if (count === 10) {
            reject(new Error(`cache not ready after ${count}s`));
          } else {
            checker();
          }
        }
      }, 1000);
    };
    checker();
  });
}

const cacheClient = new CacheClient();

export {
  cacheClient,
  CacheClientError,
  cacheClientReady
};

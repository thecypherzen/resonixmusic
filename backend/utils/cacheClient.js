import { createClient } from 'redis';
import { CACHE_EXP_SECS } from '../defaults/index.js';

class CacheClient {
  constructor() {
    this.name = 'redisClient';
    this.client = null;
    this.isReady = false;
    this.clientEngine = createClient({
      socket: {
        host: 'localhost',
        port: 5050,
      },
    }).on('error', (err) => {
      console.log(`${this.name} encountered an error: ${err}`);
    })
      .on('ready', () => {
        this.isReady = true;
        console.log(`${this.name} is ready`);
      })
      .on('end', () => console.log(`${this.name} says goodbye...`))
      .connect()
      .then((client) => {
        this.client = client;
      });
  }

  // get set del
  async get(key, buffers = true) {
    const data = await this.client.get(key);
    return buffers && data ? Buffer.from(data) : data;
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
  async hGet(hash, field, buffers = false) {
    console.log(`HGET=>hash: ${hash}, field:${field}`);
    const data = await this.client.hGet(hash, field);
    return buffers && data ? Buffer.from(data) : data;
  }

  async hSet(hash, field, value, ex = CACHE_EXP_SECS) {
    const res = await this.client.hSet(hash, field, value);
    const retVal = { res, expire: 0 };
    console.log('HSET RETURNED:', res);
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
            reject(new Error(`client ready state failed after ${count}s`));
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
export { cacheClient, cacheClientReady };

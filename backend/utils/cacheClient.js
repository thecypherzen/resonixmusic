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
    this.retryCount = 0;
    this.maxRetries = 5;
    this.retryInterval = 5000; // 5 seconds

    const config = {
      socket: {
        host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
        port: process.env.REDIS_PORT || 5050,
      },
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          // End reconnecting on a specific error
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          // End reconnecting after a specific timeout
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          // End reconnecting with built in error
          return undefined;
        }
        // Reconnect after
        return Math.min(options.attempt * 100, 3000);
      }
    };

    this.initializeClient(config);
  }

  async initializeClient(config) {
    try {
      this.clientEngine = createClient(config)
        .on('error', (err) => {
          console.error(`${this.name} encountered an error: ${err}`);
          if (!this.isReady && this.retryCount < this.maxRetries) {
            this.retryConnection();
          }
        })
        .on('ready', () => {
          this.isReady = true;
          this.retryCount = 0;
          console.log(`${this.name} is ready using port ${config.socket.port}`);
        })
        .on('end', () => {
          console.log(`${this.name} connection ended`);
          this.isReady = false;
        })
        .on('reconnecting', () => {
          console.log(`${this.name} attempting to reconnect...`);
        });

      await this.connect();
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      if (this.retryCount < this.maxRetries) {
        this.retryConnection();
      }
    }
  }

  async connect() {
    try {
      await this.clientEngine.connect();
      this.client = this.clientEngine;
      this.isReady = true;
    } catch (error) {
      console.error('Redis connection error:', error);
      throw error;
    }
  }

  retryConnection() {
    this.retryCount++;
    console.log(`Retrying connection (${this.retryCount}/${this.maxRetries}) in ${this.retryInterval/1000}s...`);
    setTimeout(() => this.connect(), this.retryInterval);
  }

  get name() {
    return this.#name;
  }

  [Symbol.toStringTag] = this.#name;

  async executeOperation(operation, ...args) {
    if (!this.isReady) {
      throw new CacheClientError('Cache is not ready', { 
        errno: 500, 
        code: 'CACHE_NOT_READY' 
      });
    }

    try {
      return await operation.apply(this, args);
    } catch (error) {
      console.error('Cache operation failed:', error);
      throw new CacheClientError(error.message, {
        errno: error.errno || 500,
        code: error.code || 'CACHE_OPERATION_FAILED',
        stack: error.stack
      });
    }
  }

  // Redis operations with error handling
  async get(key, buffers = true, format = 'binary') {
    return this.executeOperation(async () => {
      const data = await this.client.get(key);
      if (buffers && data) {
        return Buffer.from(data, format);
      }
      return data;
    });
  }

  async set(key, value, ex = CACHE_EXP_SECS) {
    return this.executeOperation(async () => {
      return await this.client.set(key, value, { EX: ex });
    });
  }

  async del(...keys) {
    return this.executeOperation(async () => {
      const promises = keys.map(key => this.client.del(key));
      await Promise.all(promises);
      return true;
    });
  }

  async hGet(hash, field, buffers = false) {
    return this.executeOperation(async () => {
      const data = await this.client.hGet(hash, field);
      return buffers && data ? Buffer.from(data) : data;
    });
  }

  async hGetAll(hash) {
    return this.executeOperation(async () => {
      return await this.client.hGetAll(hash);
    });
  }

  async hSet(hash, field, value, ex = CACHE_EXP_SECS) {
    return this.executeOperation(async () => {
      const res = await this.client.hSet(hash, field, value);
      const retVal = { res, expire: 0 };
      if (res && ex) {
        retVal.expire = await this.client.expire(hash, ex);
      }
      return retVal;
    });
  }

  async hSetMany(hash, obj, ex = CACHE_EXP_SECS) {
    return this.executeOperation(async () => {
      const promises = Object.entries(obj).map(([field, value]) => 
        this.client.hSet(hash, field, value)
      );
      const results = await Promise.all(promises);
      await this.client.expire(hash, ex);
      return true;
    });
  }

  async hDel(hash, ...fields) {
    return this.executeOperation(async () => {
      return await this.client.hDel(hash, ...fields);
    });
  }

  async ttl(key) {
    return this.executeOperation(async () => {
      return await this.client.ttl(key);
    });
  }
}

class CacheClientError extends RequestClientError {
  #name = 'CacheClientError';
  constructor(message, { errno = null, code = null, stack = null }) {
    super(message, { errno, code, stack });
  }
  [Symbol.toStringTag] = this.#name;
}

function cacheClientReady(client) {
  return new Promise((resolve, reject) => {
    let count = 0;
    const maxAttempts = 10;
    const interval = 1000; // 1 second

    const checker = () => {
      if (client.isReady) {
        return resolve(null);
      }

      count++;
      if (count >= maxAttempts) {
        return reject(new Error(`Cache not ready after ${maxAttempts} seconds`));
      }

      setTimeout(checker, interval);
    };

    checker();
  });
}

// Create singleton instance
const cacheClient = new CacheClient();

export {
  cacheClient,
  CacheClientError,
  cacheClientReady
};
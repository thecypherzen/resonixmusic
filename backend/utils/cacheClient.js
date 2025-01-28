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
    this.retryInterval = 5000;
    this.connecting = false;
    this.disabled = false;

    // Initialize Redis client with configuration
    try {
      this.initializeClient();
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      this.disabled = true;
    }
  }

  initializeClient() {
    const config = {
      socket: {
        host: process.env.NODE_ENV === 'production' ? 'localhost' : 'localhost',
        port: 5050,
        reconnectStrategy: (retries) => {
          if (retries > this.maxRetries) {
            console.log('Max reconnection attempts reached. Disabling Redis.');
            this.disabled = true;
            return false;
          }
          return this.retryInterval;
        }
      }
    };

    this.clientEngine = createClient(config)
      .on('error', (err) => {
        if (!this.disabled) {
          console.error(`${this.name} encountered an error:`, err.message);
        }
      })
      .on('ready', () => {
        this.isReady = true;
        this.retryCount = 0;
        console.log(`${this.name} is ready using port 5050`);
      })
      .on('end', () => {
        this.isReady = false;
        console.log(`${this.name} connection ended`);
      });

    // Initial connection attempt
    this.connect().catch(err => {
      console.warn('Initial Redis connection failed:', err.message);
      this.disabled = true;
    });
  }

  async connect() {
    if (this.disabled || this.isReady || this.connecting) {
      return;
    }

    try {
      this.connecting = true;
      await this.clientEngine.connect();
      this.client = this.clientEngine;
      this.isReady = true;
      this.connecting = false;
    } catch (error) {
      this.connecting = false;
      if (this.retryCount >= this.maxRetries) {
        this.disabled = true;
        console.log('Redis connection failed permanently. Running without cache.');
        return;
      }
      this.retryCount++;
      console.log(`Redis connection attempt ${this.retryCount}/${this.maxRetries} failed.`);
    }
  }

  get name() {
    return this.#name;
  }

  [Symbol.toStringTag] = this.#name;

  // Helper method to handle operations safely
  async safeOperation(operation) {
    if (this.disabled) {
      return null;
    }

    if (!this.isReady) {
      return null;
    }

    try {
      return await operation();
    } catch (error) {
      console.error('Cache operation failed:', error.message);
      return null;
    }
  }

  // Redis operations with safe handling
  async get(key, buffers = true, format = 'binary') {
    return this.safeOperation(async () => {
      const data = await this.client.get(key);
      if (buffers && data) {
        return Buffer.from(data, format);
      }
      return data;
    });
  }

  async set(key, value, ex = CACHE_EXP_SECS) {
    return this.safeOperation(async () => {
      return await this.client.set(key, value, { EX: ex });
    });
  }

  async del(...keys) {
    return this.safeOperation(async () => {
      const promises = keys.map(key => this.client.del(key));
      await Promise.all(promises);
      return true;
    });
  }

  async hGet(hash, field, buffers = false) {
    return this.safeOperation(async () => {
      const data = await this.client.hGet(hash, field);
      return buffers && data ? Buffer.from(data) : data;
    });
  }

  async hGetAll(hash) {
    return this.safeOperation(async () => {
      return await this.client.hGetAll(hash);
    });
  }

  async hSet(hash, field, value, ex = CACHE_EXP_SECS) {
    return this.safeOperation(async () => {
      const res = await this.client.hSet(hash, field, value);
      if (res && ex) {
        await this.client.expire(hash, ex);
      }
      return { res, expire: ex };
    });
  }

  async hSetMany(hash, obj, ex = CACHE_EXP_SECS) {
    return this.safeOperation(async () => {
      const promises = Object.entries(obj).map(([field, value]) => 
        this.client.hSet(hash, field, value)
      );
      await Promise.all(promises);
      if (ex) {
        await this.client.expire(hash, ex);
      }
      return true;
    });
  }

  async hDel(hash, ...fields) {
    return this.safeOperation(async () => {
      return await this.client.hDel(hash, ...fields);
    });
  }

  async ttl(key) {
    return this.safeOperation(async () => {
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

// Helper function to check if cache is ready
function cacheClientReady(client) {
  return new Promise((resolve) => {
    if (client.disabled) {
      resolve(false);
      return;
    }

    if (client.isReady) {
      resolve(true);
      return;
    }

    let attempts = 0;
    const maxAttempts = 5;
    
    const check = setInterval(() => {
      attempts++;
      if (client.isReady) {
        clearInterval(check);
        resolve(true);
      } else if (client.disabled || attempts >= maxAttempts) {
        clearInterval(check);
        resolve(false);
      }
    }, 1000);
  });
}

// Create singleton instance
const cacheClient = new CacheClient();

export {
  cacheClient,
  CacheClientError,
  cacheClientReady
};
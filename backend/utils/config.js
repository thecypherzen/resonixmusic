// defines some reusable configurations
import axios from 'axios';
import getHostUrl from './getHostUrl.js';
import { sdk } from '@audius/sdk';
import {
  MAX_RETRIES,
  TIMEOUT
} from '../defaults/index.js';

class LocalRequest {
  constructor() {
    this.client = axios.create({
      timeout: TIMEOUT,
      params: {
        app_name: 'Resonixmusic',
      },
    });
    this.client.defaults.baseURL = null;
  }

  #hosts = null;

  get host() {
    return this.client.defaults.baseURL ?? null;
  }

  async #setHosts() {
    const itr = await getHostUrl();
    if (!itr.error) {
      this.#hosts = itr;
      return { error: false }
    }
    return { ...itr };
  }
  get isReady() {
    return this.client.defaults.baseURL !== null;
  }

  init() {
    let count = 0;
    const geturl = () => {
      setTimeout(async () => {
        try {
          count += 1;
          if (!this.#hosts) {
            const setHosts  = await this.#setHosts();
            if (setHosts.error) {
              if (count >= MAX_RETRIES) {
                throw new Error(`[FATAL] Failed to fetch hosturl after ${count} attempts`);
              }
              console.log(`Connection failed. Retrying...${count}`);
              geturl();
              return;
            }
          }
          // Access the current next-available url
          this.client.defaults.baseURL = `${this.#hosts.next().value}/v1`;
          console.log(
            '[SUCCESS] Connected to',
            this.client.defaults.baseURL,
            `after ${count} attempt ${count > 1 ? 's' : ''}`
          );
          return { error: false };
        } catch (error) {
          console.log(error.message);
          if (!this.isReady && count >= MAX_RETRIES) {
            return ({
              error: true,
              message: error.message,
              details: { stack: error?.stack ?? null }
            });
          }
        }
      }, 1000);
    };
    geturl();
  }
}

class AudiusClient {
  constructor() {
    this.client = sdk({
      apiKey: process.env.AUDIUS_API_KEY,
      apiSecret: process.env.AUDIUS_API_SECRET,
    });
  }

  async getTrack(trackId) {
    try {
      const track = await this.client.tracks.getTrack({ trackId });
      console.log('track fectched', track);
      return { error: false, track };
    } catch (error) {
      return {
        error: true,
        message: error.message,
        stack: error.stack
      };
    }
  }
}

const audius = null;
// const audius = new AudiusClient();
const requestClient = new LocalRequest();
requestClient.init();

export {
  audius,
  requestClient,
};


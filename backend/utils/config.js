// defines some reusable configurations
import axios from 'axios';
import getHostUrl from './getHostUrl.js';
import { sdk } from '@audius/sdk';
class LocalRequest {
  constructor() {
    this.client = axios.create({
      timeout: 15000,
      params: {
        app_name: 'Resonixmusic',
      },
    });
    this.client.defaults.baseURL = null;
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
          const result = await getHostUrl(); // Assume this returns an object with a 'url' property

          if (result.failed) {
            if (!this.isReady && count >= 10) {
              console.log('count: ', count);
              throw new Error('failed to fetch resonix hosturl');
            }
            geturl();
          } else {
            this.client.defaults.baseURL = `${result.url}/v1`; // Access the 'url' property
            console.log('hostname set to', this.client.defaults.baseURL, `after ${count}s`);
            return true;
          }
        } catch (error) {
          console.error('Error fetching host URL:', error);
          if (!this.isReady && count >= 10) {
            throw new Error('failed to fetch resonix hosturl');
          }
          geturl();
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
    const track = await this.client.tracks.getTrack({ trackId });
    console.log('track fecthced', track);
    return track;
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


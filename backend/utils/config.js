// defines some reusable configurations
import axios from 'axios';
import getHostUrl from './getHostUrl';

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
        count += 1;
        const result = await getHostUrl();
        if (result.failed) {
          if (!this.isReady && count >= 10) {
            console.log('count: ', count);
            throw new Error('failed to fetch resonix hosturl');
          }
          geturl();
        }
        this.client.defaults.baseURL = `${result.next().value}/v1`;
        console.log('hostname set to',
          this.client.defaults.baseURL, `after ${count}s`);
        return true;
      }, 1000);
    };
    geturl();
  }
}

const requestClient = new LocalRequest();
requestClient.init();

const nothing = null;

export {
  requestClient,
  nothing,
};

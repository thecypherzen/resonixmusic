// defines some reusable configurations
import axios from 'axios';
import getHostUrl from './getHostUrl';

class LocalRequest {
  constructor() {
    this.client = axios.create({
      timeout: 10000,
      params: {
        app_name: 'Resonixmusic',
      },
    });
  }

  get isReady() {
    return this.baseUrl === null;
  }

  init() {
    let count = 0;
    const geturl = async () => {
      const result = await getHostUrl();
      if (result.failed) {
        return false;
      }
      this.client.defaults.baseURL = `${result.next().value}/v1`;
      return true;
    };

    setTimeout(async () => {
      count += 1;
      if (count >= 10 && !this.isReady()) {
        throw new Error('failed to fetch resonix host url');
      }
      if (await geturl()) {
        return;
      }
      await geturl();
    }, 1000);
  }
}

const requestClient = new LocalRequest();
requestClient.init();

const nothing = null;

export {
  requestClient,
  nothing,
};

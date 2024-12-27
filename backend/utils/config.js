// defines some reusable configurations
import axios from 'axios';
import getHostUrl from './getHostUrl';

class LocalRequest {
  constructor() {
    this.hostUrl = null;
    this.axios = axios.create({
      params: {
        app_name: 'Resonixmusic',
      },
    });
  }

  get isReady() {
    return this.hostUrl === null;
  }

  init() {
    let count = 0;
    const geturl = async() => {
      const result = await getHostUrl();
      if (result.failed) {
        return false;
      }
      this.hostUrl = result.next().value;
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

const requestMaker = new LocalRequest();
requestMaker.init();

const nothing = null;

export {
  requestMaker,
  nothing,
};

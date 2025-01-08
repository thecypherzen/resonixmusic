// defines some reusable configurations
import axios from 'axios';
import {
  JAMENDO as jamendo,
  MAX_RETRIES as retries,
  TIMEOUT as timeout,
} from '../defaults/index.js';

class RequestClient {
  constructor() {
    this.client = axios.create({
      timeout,
      params: {
        format: 'jsonpretty',
        client_id: jamendo.id,
      },
    });
    this.client.defaults.baseURL = null;
  }

  #url = `${jamendo.base}/${jamendo.version}`

  get url() { return this.#url }

  init() {
    this.client.defaults.baseURL = this.#url;
  }

  isReady(){
    return this.client.defaults.baseURL != null;
  }
}
const nothing = null;
const requestClient = new RequestClient();
requestClient.init();

export {
  nothing,
  requestClient,
};


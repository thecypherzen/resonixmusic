import axios from 'axios';
import getHostUrl from './getHostUrl.js';

class RequestClient {
  constructor() {
    this.hostUrl = null;
    this.appName = 'Resonix';
  }

  async initialize() {
    if (!this.hostUrl) {
      const hostIterator = await getHostUrl();
      const { value } = hostIterator.next();
      this.hostUrl = value;
    }
  }

  async client(config) {
    await this.initialize();
    
    const requestConfig = {
      ...config,
      url: `${this.hostUrl}${config.url}`,
      params: {
        ...config.params,
        app_name: this.appName
      }
    };

    try {
      return await axios(requestConfig);
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }
}

export const requestClient = new RequestClient();
import axios from 'axios';
import getHostUrl from './getHostUrl.js';

class RequestClient {
  constructor() {
    this.hostUrl = null;
    this.appName = 'Resonix';
  }

  async initialize() {
    if (!this.hostUrl) {
      try {
        this.hostUrl = await getHostUrl();
        console.log('Initialized with host:', this.hostUrl);
      } catch (error) {
        console.error('Failed to initialize host:', error);
        throw error;
      }
    }
  }

  async client(config) {
    try {
      await this.initialize();
      
      const requestConfig = {
        ...config,
        url: `${this.hostUrl}/v1${config.url}`,
        params: {
          ...config.params,
          app_name: this.appName
        }
      };

      console.log('Making request to:', requestConfig.url);
      const response = await axios(requestConfig);
      return response;
    } catch (error) {
      console.error('Request failed:', error.message);
      throw error;
    }
  }
}

export const requestClient = new RequestClient();
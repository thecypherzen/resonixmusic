import axios from 'axios';

export default async function getHostUrls() {
  try {
    const response = await axios.get('https://api.audius.co/');
    if (!(response?.data?.data || []).length) {
      console.log('error occured...');
      throw new Error('No Host Urls available.');
    }
    const data = response.data.data;
    const max = data.length
    let i = 0;
    return {
      error: false,
      next() {
        if (i < 0 || i >= max) {
          i = 0;
        }
        return { value: data[i], done: false }
      },
    }
  } catch (error) {
    const err = new Error('[FATAL]. Host servers unavailable');
    return {
      error: true,
      message: err.message,
      details: { stack: error.stack },
    };
  }
}

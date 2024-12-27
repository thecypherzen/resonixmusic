import axios from 'axios';

export default async function getHostUrl() {
  const response = await axios.get('https://api.audius.co/');
  if (!response?.data.data.length) {
    return { failed: true };
  }
  const data = response.data.data;
  const max = data.length
  let i = 0;
  return {
    next() {
      if (i < 0 || i >= max) {
        i = 0;
      }
      return { value: data[i], done: false }
    },
  }
}

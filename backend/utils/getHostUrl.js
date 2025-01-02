import axios from 'axios';

export default async function getHostUrl() {
  try {
    const response = await axios.get('https://discoveryprovider.audius.co', {
      timeout: 10000
    });
    
    if (!response?.data?.data?.length) {
      console.error('No host data received from Audius API');
      return { failed: true };
    }
    
    const data = response.data.data;
    const max = data.length;
    let i = 0;
    return {
      next() {
        if (i < 0 || i >= max) {
          i = 0;
        }
        const value = data[i];
        i++;
        return { value, done: false };
      },
    };
  } catch (error) {
    console.error('Error fetching Audius host:', error.message);
    return { failed: true };
  }
}
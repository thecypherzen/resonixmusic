import axios from 'axios';

export default async function getHostUrl() {
  try {
    const response = await axios.get('https://api.audius.co');
    if (!response?.data?.data?.[0]) {
      throw new Error('No Audius hosts available');
    }
    
    // Return the first available host
    return response.data.data[0];
  } catch (error) {
    console.error('Failed to get Audius host:', error);
    throw error;
  }
}
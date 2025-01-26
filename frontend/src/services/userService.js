import { API_BASE_URL } from '../constants/config';

export const fetchUserProfile = async (accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users?access_token=${accessToken}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    return data.results[0];
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
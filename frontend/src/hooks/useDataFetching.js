import { useState, useEffect } from 'react';
import { dataCache } from '../utils/cache';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export const useDataFetching = (
  fetchFunction,
  cacheKey,
  dependencies = [],
  options = { retries: MAX_RETRIES, delay: RETRY_DELAY }
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async (retryAttempt = 0) => {
    try {
      // Check cache first
      const cachedData = dataCache.get(cacheKey);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      const response = await fetchFunction();
      
      // Cache the successful response
      dataCache.set(cacheKey, response.data);
      
      setData(response.data);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      console.error(`Fetch attempt ${retryAttempt + 1} failed:`, err);
      
      if (retryAttempt < options.retries) {
        setTimeout(() => {
          setRetryCount(retryAttempt + 1);
          fetchData(retryAttempt + 1);
        }, options.delay * (retryAttempt + 1)); // Exponential backoff
      } else {
        setError(err);
        // Use cached data as fallback if available
        const cachedData = dataCache.get(cacheKey);
        if (cachedData) {
          setData(cachedData);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [...dependencies]);

  return { data, loading, error, retryCount, retry: () => fetchData(0) };
};
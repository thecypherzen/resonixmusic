import { useState, useEffect, useCallback } from "react";
import { dataCache } from "../utils/cache";
import { CACHE_DEFAULTS } from "../constants/config";
import api from "../services/api";

const CURRENT_DATE = "2025-01-23 15:02:45";
const CURRENT_USER = "gabrielisaacs";
//fetchFunction,
//cacheKey,
//options = {
//  retries: CACHE_DEFAULTS.max_retries,
//  delay: CACHE_DEFAULTS.delay,
//  cacheKeyPrefix: CACHE_DEFAULTS.key_prefix,
//}
const fetchDefaults = {
  artists: {
    url: "/artists",
    options: { params: { limit: 20 } },
  },
};
export const useFetch = (options) => {
  /**
   * Options signature
   * { type: artists | tracks |,
   *   method: "get" | "post", | "put" | "delete" | "head",
   *   extras: Record<string, any>
   * }
   */
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fullCacheKey = `${CACHE_DEFAULTS.key_prefix}${
    CACHE_DEFAULTS.keys[options.type]
  }`;

  const fetchData = useCallback(async (retryAttempt = 0) => {
    let response;
    try {
      // Check cache first
      const cachedData = dataCache.get(fullCacheKey);
      if (cachedData) {
        console.log(`Cache hit for ${fullCacheKey}`);
        setData(cachedData);
      }
      // make request
      const defaults = fetchDefaults[options.type];
      switch (options.method.toLowerCase()) {
        case "get":
          response = await api.get(defaults.url, {
            ...defaults.options,
            ...options?.extras,
          });
          console.log("\nResponse:", response);
          if (response.success) {
            setData(response.data);
            // Cache the successful response
            dataCache.set(fullCacheKey, response.data);
          } else {
            let reason,
              message = "Try again later";
            switch (response.data?.errno) {
              case 1:
              case 3:
                reason = "An error on our part";
                break;
              case 2:
                reason = "A network Error";
                message = "Check your connection or try again later";
                break;
              default:
                reason = "An unknown Error";
            }
            setError({ ...response.data, reason, message });
          }
          break;
        default:
          console.log("\nANOTHER REQUEST TYPE", options);
          break;
      }
      //console.log(`Data successfully fetched and cached for ${fullCacheKey}`);
    } catch (err) {
      console.error(
        `Fetch attempt ${retryAttempt + 1} failed for ${fullCacheKey}:`,
        err
      );

      if (retryAttempt < options.retries) {
        const nextRetryDelay = options.delay * Math.pow(2, retryAttempt); // Exponential backoff
        console.log(`Retrying in ${nextRetryDelay}ms...`);
        setTimeout(() => {
          setRetryCount(retryAttempt + 1);
          fetchData(retryAttempt + 1);
        }, nextRetryDelay);
      } else {
        setError(err);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const retry = async () => {
    console.log(`Manual retry initiated for ${fullCacheKey}`);
    setRetryCount(0);
    setError(null);
    await fetchData(0);
  };
  console.log("returning");
  return {
    data,
    error,
    retryCount,
    retry,
    isStale: dataCache.isStale(fullCacheKey),
  };
};

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
  tracks: {
    url: "/tracks",
    options: { params: { limit: 30 } },
  },
  albums: {
    url: "/albums",
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

  const fetchData = useCallback(async () => {
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
          // handle success
          switch (response.success) {
            case true:
              setData(response.data);
              // Cache the successful response
              dataCache.set(fullCacheKey, response.data);
              break;
            default:
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
    } catch (err) {
      console.error(`Fetch Failed`, err);
    }
  }, []);

  // fetchData is called when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  return { data, error };
};

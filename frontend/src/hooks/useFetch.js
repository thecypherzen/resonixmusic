import { useState, useEffect, useCallback } from "react";
import { dataCache } from "../utils/cache";
import { CACHE_DEFAULTS } from "../constants/config";
import api from "../services/api";

const fetchDefaults = {
  "/albums": {
    options: { params: { limit: 20 } },
  },
  "/artists": {
    options: { params: { limit: 20 } },
  },
  "/artists/info": {},
  "/artists/tracks": {},
  "/playlists": {
    options: { params: { limit: 20 } },
  },
  "/tracks": {
    options: { params: { limit: 30 } },
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
  if (!options.url) {
    throw new Error("Data fetch failed. URL undefined");
  }
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fullCacheKey = `${CACHE_DEFAULTS.key_prefix}${options.url
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace("/", "-")}${
    options?.params?.id?.length ? `-${options.params.id[0]}` : ""
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
      const defaults = fetchDefaults[options.url];
      switch (options?.method?.toLowerCase() || "get") {
        case "get":
          response = await api.get(options.url, {
            ...defaults?.options,
            ...options?.extras,
          });
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

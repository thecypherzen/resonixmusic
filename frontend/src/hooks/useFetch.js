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
  "/playlists/tracks": {
    options: {},
  },
  "/tracks": {
    options: { params: { limit: 30 } },
  },
};

const fetchData = async (options) => {
  if (!options.url) {
    throw { message: "Data fetch failed. URL undefined" };
  }
  // get proper cache key
  const fullCacheKey = `${CACHE_DEFAULTS.key_prefix}${options.url
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace("/", "-")}${
    options?.extras?.params?.id?.length ? `-${options.extras.params.id[0]}` : ""
  }`;

  // default response values
  let response;

  // function main
  try {
    // Check cache first
    const cachedData = dataCache.get(fullCacheKey);
    if (cachedData) {
      return cachedData;
    }
    // make request
    const defaults = fetchDefaults[options.url];
    switch (options?.method?.toLowerCase() || "get") {
      case "get":
        response = await api.get(options.url, {
          ...defaults?.options,
          ...options?.extras,
        });
        if (options.url.startsWith("/playlists")) {
          console.log(response);
        }
        // handle success
        switch (response.success) {
          case true:
            // Cache the successful response
            dataCache.set(fullCacheKey, response.data);
            return response.data;
          default:
            console.error(response);
            let reason,
              message = "Try again later";
            switch (response.data?.errno) {
              case 1:
              case 3:
                console.error("=> errno 3");
                switch (response.data?.details?.code) {
                  case "ECONNABORTED":
                    console.error("==> ECONABORTED");
                    reason = "Timed out request";
                    break;
                  default:
                    reason = "An error on our part";
                    break;
                }
                break;
              case 2:
                console.log("case 2");
                reason = "A network Error";
                message = "Check your connection or try again later";
                break;
              default:
                console.log("using default");
                reason = "An unknown Error";
            }
            const error = { ...response.data, reason, message };
            throw error;
        }
      default:
        // other request type
        console.log("\nANOTHER REQUEST TYPE", options);
        return [];
    }
  } catch (err) {
    console.error(err);
    throw { reason: "Unknown", ...err };
  }
};

export const useFetch = (options, cancel = false, deps = []) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  /**
   * Options signature
   * { type: artists | tracks |,
   *   method: "get" | "post", | "put" | "delete" | "head",
   *   extras: Record<string, any>
   * }
   */

  useEffect(() => {
    if (cancel) {
      console.log("USE EFFECT CANCELLING!!!! for:", options.url);
      return;
    }
    console.log("USE EFFECT GOING THROUGHG for:", options.url);
    if (!options.url) {
      setError({ message: "Data fetch failed. URL undefined" });
      return;
    }
    fetchData(options)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("--> useFetch error:", err);
        setError(err);
      });
  }, [options.url, JSON.stringify(options.extras), ...deps]);
  return { data, error };
};

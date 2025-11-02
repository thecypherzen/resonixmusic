import { randomImage } from "@/lib/utils";
import { useState, useEffect } from "react";
import { UseAppState } from "./UseAppState";

// Cache for storing generated patterns

export const UseThumbnail = (namespace, id) => {
  const { thumbnailStore: tnStore } = UseAppState();
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (!namespace || !id) return;

    const key = `${namespace}-${id}`;
    if (!tnStore.has(key)) {
      randomImage("square").then((v) => {
        tnStore.set(key, v);
        setThumbnail(v);
      });
    } else {
      setThumbnail(tnStore.get(key));
    }
  }, [namespace, id]);

  return thumbnail;
};

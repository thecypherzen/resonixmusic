import { iteratorFromArray, getRandomImages } from "@/lib/utils";
import { useState, useEffect } from "react";
import { dataCache } from "@/utils/cache";

// Cache for storing generated patterns

export const UseRandomImages = (namespace, id) => {
  const key = `${namespace}-${id}`;
  const [randomImage, setRandomImage] = useState(null);
  const [imageIterator, setImageIterator] = useState(null);

  const cacheImage = (namespace, id, image) => {
    if (!namespace || !id) return;
    dataCache.set(key, image);
  };

  const getCachedImage = (namespace, id) => {
    if (!namespace || !id) return null;
    return dataCache.get(key);
  };

  const fetchRandomImage = (a = namespace, b = id) => {
    let img = getCachedImage(a, b);
    if (!!img) return img;
    if (!!!imageIterator) return "";
    img = imageIterator.next().value;
    cacheImage(a, b, img);
    return img;
  };

  useEffect(() => {
    if (!imageIterator) {
      getRandomImages().then((res) => {
        setImageIterator(iteratorFromArray(res));
      });
    }
  }, []);

  useEffect(() => {
    if (!namespace || !id) return;
    // check if image in cache and return if true
    const key = `${namespace}-${id}`;
    let v = dataCache.get(key);
    if (v) {
      setRandomImage(v);
      return;
    }
    if (!imageIterator) return;

    // pick next value from fallback bank of images

    const img = imageIterator.next().value;
    dataCache.set(key, img);
    setRandomImage(img);
    return;
  }, [namespace, id, imageIterator]);

  return {
    image: randomImage,
    imageIterator,
    cacheImage,
    getCachedImage,
    fetchRandomImage,
  };
};

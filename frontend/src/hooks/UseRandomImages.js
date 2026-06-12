import { iteratorFromArray, getRandomImages } from "@/lib/utils";
import { useState, useEffect } from "react";
import { UseAppState } from "./UseAppState";
import { dataCache } from "@/utils/cache";

// Cache for storing generated patterns

export const UseRandomImages = (namespace, id) => {
  const { imagesStore } = UseAppState();
  const [randomImages, setRandomImages] = useState(null);
  const [randomImage, setRandomImage] = useState(null);
  const [imageGenerator, setImageGenerator] = useState(null);

  const cacheImage = (namespace, id, image) => {
    if (!namespace || !id) return;
    const key = `${namespace}-${id}`;
    dataCache.set(key, image);
  };

  const getCachedImage = (namespace, id) => {
    if (!namespace || !id) return null;
    const key = `${namespace}-${id}`;
    return dataCache.get(key);
  };

  const fetchRandomImage = (namespace, id) => {
    let img = getCachedImage(namespace, id);
    if (!!img) return img;
    if (!!!imageGenerator) return "";
    img = imageGenerator.next().value;
    cacheImage(namespace, id, img);
    return img;
  };

  useEffect(() => {
    if (!randomImages) {
      getRandomImages().then((res) => {
        setImageGenerator(iteratorFromArray(res));
        setRandomImages(res);
      });
    }
  }, []);

  useEffect(() => {
    if (!namespace || !id) return;

    const key = `${namespace}-${id}`;
    if (imagesStore.has(key)) {
      setRandomImage(imagesStore.get(key));
      return;
    }
    if (imageGenerator) {
      const img = imageGenerator.next().value;
      setRandomImage(img);
      imagesStore.set(key, img);
      return;
    }
    if (randomImages) {
      setImageGenerator(iteratorFromArray(randomImages));
      return;
    }
    getRandomImages().then((res) => {
      setRandomImages(res);
    });
  }, [namespace, id, randomImages, randomImage, imageGenerator, imagesStore]);

  return {
    image: randomImage,
    imageGenerator,
    cacheImage,
    getCachedImage,
    fetchRandomImage,
  };
};

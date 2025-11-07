import { generatorFromArray, getRandomImages } from "@/lib/utils";
import { useState, useEffect } from "react";
import { UseAppState } from "./UseAppState";

// Cache for storing generated patterns

export const UseRandomImages = (namespace, id) => {
  const { imagesStore } = UseAppState();
  const [randomImages, setRandomImages] = useState(null);
  const [randomImage, setRandomImage] = useState(null);
  const [imageGenerator, setImageGenerator] = useState(null);

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
      setImageGenerator(generatorFromArray(randomImages));
      return;
    }
    getRandomImages().then((res) => {
      setRandomImages(res);
    });
  }, [namespace, id, randomImages, randomImage, imageGenerator, imagesStore]);

  return { image: randomImage, imageGenerator };
};

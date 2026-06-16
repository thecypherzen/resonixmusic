import { UNSPLASH_CLIENT_ID } from "@/constants/config";
import API from "@/services/api";
import { dataCache } from "@/utils/cache";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function capitalise(text) {
  if (typeof text !== "string" || !text) {
    return text;
  }
  return `${text[0].toUpperCase()}${text.slice(1)}`;
}

export function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function transformArtist(artist) {
  return {
    id: artist.id,
    name: artist.name,
    website: artist.website,
    joinDate: artist.joindate,
    thumbnail: artist.image,
    shortUrl: artist.shorturl,
    shareUrl: artist.shareurl,
    musicInfo: artist?.musicinfo ?? null,
    tracks: artist?.tracks?.map((t) => t.id) ?? null,
  };
}

export function transformPlaylist(playlist) {
  return {
    id: playlist.id,
    title: capitalise(playlist.name),
    releaseDate: playlist.creationdate,
    userId: playlist.user_id,
    userName: capitalise(playlist.user_name),
    zip: playlist.zip,
    shareUrl: playlist.shareurl,
    shortUrl: playlist.shorturl,
    tracks: playlist?.tracks?.map((track) => track.id) ?? null,
    ownerThumbnail: `https://usercontent.jamendo.com?type=user&id=${playlist.user_id}&width=400`,
  };
}

export function transformTrack(track) {
  return {
    albumId: track.album_id, // playlist: Y album:
    albumThumbnail: track.album_image, // playlist: Y album:
    artistId: track.artist_id, // playlist: Y album: Y
    artist: capitalise(track.artist_name) || "Unknown Artist", // playlist: Y album: Y
    streamUrl: track.audio, // playlist: Y album:
    downloadUrl: track.audiodownload || "", // playlist: Y album:
    downloadable: track.audiodownload_allowed, // playlist: Y album:
    duration: parseInt(track.duration || 0), // playlist: Y album:
    id: track.id, // playlist: Y album: Y
    thumbnail: track.image, // playlist: Y album: Y
    title: capitalise(track.name), // playlist: Y album: Y
    position: parseInt(track.position), // playlist: Y album:
    releaseDate: track.releasedate || track.playlistadddate, // playlist: N album: Y
    likes: `${Math.floor(Math.random() * 100)}k`, // playlist: y album:
    albumName: track.album_name, // playlist: N album: Y
  };
}

export function transformAlbum(album) {
  return {
    id: album.id,
    title: album.name,
    artist: album.artist_name,
    artistId: album.artist_id,
    thumbnail: album.image,
    ownerThumbnail: `https://usercontent.jamendo.com?type=artist&id=${album.artist_id}&width=400`, // Add artist_image
    releaseDate: album.releasedate,
    tracks: album?.tracks?.map((track) => track.id) ?? [],
  };
}

const fallbackArtworks = [
  "/artworks/artwork_1.jpg",
  "/artworks/artwork_2.jpg",
  "/artworks/artwork_3.webp",
  "/artworks/artwork_4.jpeg",
  "/artworks/artwork_5.webp",
  "/artworks/artwork_6.jpeg",
  "/artworks/artwork_7.jpeg",
  "/artworks/artwork_8.jpg",
  "/artworks/artwork_9.jpeg",
  "/artworks/artwork_10.jpg",
];

export function iteratorFromArray(arr) {
  let div = 1;
  const len = arr.length;
  while (Math.floor(len / div) > 0) div *= 10;
  let i = Math.floor(Math.random() * div) % len;

  return {
    next() {
      if (i < len) {
        return { value: arr[i++], done: false };
      }
      i = 0;
      return { value: arr[i++], done: false };
    },
  };
}

export function getRandomImages(
  orientation = "landscape",
  type = "raw",
  count = 30,
) {
  // first check cache if we've saved the data before
  const cacheKey = "fallback-images";
  const cachedImagesData = dataCache.get(cacheKey);
  if (cachedImagesData) return Promise.resolve(JSON.parse(cachedImagesData));
  /*
   * Orientation values: landscape, portrait, squarish
   * Type values: raw, full, regular, small, thumb
   */
  return API.imageClient
    .get("/random", {
      params: {
        query: "music",
        orientation,
        client_id: UNSPLASH_CLIENT_ID,
        count,
      },
    })
    .then((res) => {
      const d = res?.data?.map((m) => m.urls?.[type]);
      dataCache.set(cacheKey, JSON.stringify(d));
      return d;
    })
    .catch((err) => {
      console.error("err from imageclient:", err);
      dataCache.set(cacheKey, JSON.stringify(fallbackArtworks));
      return fallbackArtworks;
    });
}

export const dataPaginator = (items, itemsPerPage) => {
  if (Object.getPrototypeOf(items).constructor.name !== "Array") {
    throw new Error("Pagination items must be an array");
  }
  const totalPages = Math.ceil(items.length / itemsPerPage);
  let currentPage = 1;

  // Calculate the items to be displayed on the current page
  const getPageItems = (page) =>
    items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  // Handler for navigating pages
  const next = () => {
    currentPage = Math.min(currentPage + 1, totalPages);
    return {
      currentPage,
      totalPages,
      items: getPageItems(currentPage),
      next,
      prev,
    };
  };
  // Handler for previous page
  const prev = () => {
    currentPage = Math.max(currentPage - 1, 1);
    return {
      currentPage,
      totalPages,
      items: getPageItems(currentPage),
      next,
      prev,
    };
  };

  return {
    currentPage,
    totalPages,
    items: getPageItems(currentPage),
    next,
    prev,
  };
};

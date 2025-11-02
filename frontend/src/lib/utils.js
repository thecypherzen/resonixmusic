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

export function transformPlaylist(playlist) {
  return {
    creationDate: playlist.creationdate,
    id: playlist.id,
    title: capitalise(playlist.name) || "",
    artist: capitalise(playlist.user_name) || "",
    shareUrl: playlist.shareurl,
    shortUrl: playlist.shorturl,
    userId: playlist.user_id,
    tracks: playlist.tracks,
    zip: playlist.zip,
  };
}

export function transformTrack(track) {
  return {
    id: track.id,
    title: track.name,
    artist: capitalise(track.artist_name) || "Unknown Artist",
    thumbnail: track.image || track.album_image,
    streamUrl: track.audio,
    duration: parseInt(track.duration || 0),
    likes: `${Math.floor(Math.random() * 100)}k`,
    albumName: track.album_name,
    albumId: track.album_id,
    releaseDate: track.releasedate,
    downloadable: track.audiodownload_allowed,
    downloadUrl: track.audiodownload || "",
  };
}

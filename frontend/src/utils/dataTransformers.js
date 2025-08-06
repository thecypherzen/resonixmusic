export default {
  albums: (albums, artistName) =>
    albums.map((album) => ({
      id: album.id,
      title: album.name,
      artist: artistName,
      thumbnail: album.image,
      releaseDate: album.releasedate,
    })),
  artists: (artists) =>
    artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
      website: artist.website,
      joindate: artist.joindate,
      image:
        artist.image ||
        `https://usercontent.jamendo.com?type=artist&id=${artist.id}&width=500`,
      shorturl: artist.shorturl,
      shareurl: artist.shareurl,
      musicinfo: {
        tags: artist.musicinfo?.tags || [],
        description: artist.musicinfo?.description || {},
      },
    })),
  tracks: (tracks, artistName) =>
    tracks.map((track) => ({
      id: track.id,
      title: track.name,
      artist: artistName || "Unknown Artist",
      thumbnail: track.image || track.album_image,
      url: track.audio,
      stream_url: track.audio,
      duration: parseInt(track.duration || 0),
      likes: `${Math.floor(Math.random() * 100)}k`,
      album_name: track.album_name,
      album_id: track.album_id,
      releasedate: track.releasedate,
      downloadable: track.audiodownload_allowed,
      download_url: track.audiodownload || "",
    })),
};

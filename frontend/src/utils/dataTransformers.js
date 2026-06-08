//export default {
//  albums: (albums, artistName) =>
//    albums.map((album) => ({
//      id: album.id,
//      title: album.name,
//      artist: artistName,
//      thumbnail: album.image,
//      releaseDate: album.releasedate,
//    })),

//  tracks: (tracks, artistName) =>
//    tracks.map((track) => ({
//      id: track.id,
//      title: track.name,
//      artist: artistName || "Unknown Artist",
//      thumbnail: track.image || track.album_image,
//      url: track.audio,
//      stream_url: track.audio,
//      duration: parseInt(track.duration || 0),
//      likes: `${Math.floor(Math.random() * 100)}k`,
//      album_name: track.album_name,
//      album_id: track.album_id,
//      releasedate: track.releasedate,
//      downloadable: track.audiodownload_allowed,
//      download_url: track.audiodownload || "",
//    })),
//};

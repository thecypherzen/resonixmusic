// Define dummy data that matches Jamendo API structure
const DUMMY_DATA = {
  tracks: Array(30)
    .fill(null)
    .map((_, index) => ({
      id: `track-${index + 1}`,
      name: `Track ${index + 1}`,
      artist_name: `Artist ${Math.floor(index / 3) + 1}`,
      image: `https://picsum.photos/400/400?random=${index}`,
      audio: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${
        (index % 15) + 1
      }.mp3`,
      duration: 180 + index * 30,
      sharecount: Math.floor(Math.random() * 500) + 50,
      is_streamable: "true",
      listened: Math.floor(Math.random() * 100000),
    })),

  artists: Array(15)
    .fill(null)
    .map((_, index) => ({
      id: `artist-${index + 1}`,
      name: `Artist ${index + 1}`,
      image: `https://picsum.photos/400/400?random=${index + 100}`,
      joindate: CURRENT_DATE,
      website: "https://example.com",
    })),

  albums: Array(15)
    .fill(null)
    .map((_, index) => ({
      id: `album-${index + 1}`,
      name: `Album ${index + 1}`,
      artist_name: `Artist ${Math.floor(Math.random() * 15) + 1}`,
      image: `https://picsum.photos/400/400?random=${index + 200}`,
      tracks_count: Math.floor(Math.random() * 20) + 5,
      releasedate: CURRENT_DATE,
    })),

  playlists: Array(15)
    .fill(null)
    .map((_, index) => ({
      id: `playlist-${index + 1}`,
      name: `Playlist ${index + 1}`,
      creationdate: CURRENT_DATE,
      user_id: `user-${index + 1}`,
      user_name: `User ${index + 1}`,
      image: `https://picsum.photos/400/400?random=${index + 200}`,
      shorturl: `https://jamen.do/l/p${index + 1}`,
      shareurl: `https://www.jamendo.com/list/p${index + 1}`,
    })),
};

export default DUMMY_DATA;

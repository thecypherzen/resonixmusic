async function getTracks (req, res) {
  console.log('getting album tracks');
  return res.send('getAlbumTracks returned');
}

export default getTracks;

async function getAlbums(req, res) {
  return res.send({ controller: 'getUsersAlbums' });
}

export default getAlbums;

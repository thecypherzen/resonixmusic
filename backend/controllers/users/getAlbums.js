async function getAlbums(req, res) {
  return res.send({ endpoint: 'getUsersAlbums' });
}

export default getAlbums;

async function getArtists(req, res) {
  return res.send({ controller: 'getUsersArtists' });
}

export default getArtists;

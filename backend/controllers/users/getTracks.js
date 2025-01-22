async function getTracks(req, res) {
  return res.send({ controller: 'getUsersTracks' });
}

export default getTracks;

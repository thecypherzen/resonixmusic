async function postMyAlbum(req, res) {
  console.log('postMyAlbum');
  return res.send({controller: 'postMyAlbum'});
}

export default postMyAlbum;

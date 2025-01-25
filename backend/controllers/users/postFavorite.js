async function postFavorite(req, res) {
  console.log('postfavorite');
  return res.send({controller: 'postFavorite'});
}

export default postFavorite;

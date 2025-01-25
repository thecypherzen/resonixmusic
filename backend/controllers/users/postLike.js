async function postLike(req, res) {
  console.log('postlike');
  return res.send({controller: 'postLike'});
}

export default postLike;

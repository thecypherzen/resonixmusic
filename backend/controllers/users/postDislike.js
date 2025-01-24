async function postDislike(req, res) {
  console.log('postdislike');
  return res.send({controller: 'postDislike'});
}

export default postDislike;

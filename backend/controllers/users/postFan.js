async function postFan(req, res) {
  console.log('postfan');
  return res.send({controller: 'postFan'});
}

export default postFan;

async function authorize(req, res) {
  console.log('new authorization request');
  return res.send({ route: 'new authorization request' });
}

export default authorize;

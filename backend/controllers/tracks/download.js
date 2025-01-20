async function download(req, res) {
  console.log('downloading tracks');
  return res.send({controller: 'downloadTracks'});
}

export default download;

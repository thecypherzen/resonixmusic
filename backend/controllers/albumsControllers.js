import {
  matchedData,
  validationResult,
} from 'express-validator';

import {
  requestClient,
} from '../utils/index.js';

import {
  CACHE_EXP_SECS,
  RESPONSE_CODES as resCodes,
} from '../defaults/index.js';


async function download(req, res) {
  //download album
  return res.send('download successful');
}

async function getInfo(req, res) {
  // fetch as many albums as possible
  const validation = validationResult();
  const iHeaders = {
    warnings: '',
  };

  if (!validation.isEmpty()) {
    const errors = validation.array();
    console.log(errors);
    return res.status(400).send({
      headers: {
        ...iHeaders,
        status: 'failed',
        code: errors.client_id
          ? resCodes[4].code : resCodes[3].code,
        error_message: `${JSON.stringify(errors)}`,
      },
      results: JSON.stringify([]),
    });
  }
}

async function getTracks(req, res) {
  // get album tracks
}
export {
  download,
  getInfo,
  getTracks,
}

import filters from './filters.js';
import getPageFromArray from './getPageFrom.js';
import errorHandlers from './errorHandlers.js';
import storage from './localStorage.js';
import {
  RequestClient,
  requestClient,
  RequestClientError,
} from './requestClient.js';

import {
  cacheClient,
  CacheClientError,
  cacheClientReady
} from './cacheClient.js';

import {
  authClient,
  AuthError,
  authManager,
} from '../controllers/auth/utils/index.js';

import getHostUrl from './getHostUrl.js';

export {
  cacheClient,
  CacheClientError,
  cacheClientReady,
  errorHandlers,
  filters,
  getPageFromArray,
  RequestClient,
  requestClient,
  RequestClientError,
  authClient,
  AuthError,
  authManager,
  storage,
  getHostUrl,
};

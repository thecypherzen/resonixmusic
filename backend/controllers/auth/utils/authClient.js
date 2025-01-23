import crypto from 'crypto';
import qs from 'qs';
import { matchedData, validationResult } from 'express-validator';
import AuthError from './authError.js';
import {
  JAMENDO as api
} from '../../../defaults/index.js';
import {
  cacheClient,
  errorHandlers as handlers,
  RequestClient
} from '../../../utils/index.js';

class AuthClient extends RequestClient {
  constructor(){
    super();
  }

  #redirect_uri = api.cbUrl;
  #auth_url = `${this.#redirect_uri}/authorize`;
  #grant_url = `${this.#redirect_uri}/verify`;
  #name = 'AuthClient';


  get redirectUrl() {
    return this.#redirect_uri;
  }
  get authUrl() {
    return this.#auth_url;
  }

  get grantUrl() {
    return this.#grant_url;
  }

  get name() {
    return this.#name;
  }

  async cacheAuthData(data) {
    const {
      access_token,
      expires_in,
      refresh_token,
      scope,
      token_type,
    } = data;
    const promises = [
      cacheClient.hSetMany(
        `token:${access_token}`,
        { scope, token_type,},
        expires_in
      ),
      cacheClient.set(
        `refresh:${access_token}`,
        refresh_token,
        expires_in + 3600
      )
    ];
    try {
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  clearState() {
    return cacheClient.del('state')
  }

  async clearTokenData(token){

  }

  async clearTokenData(token){
    const result = await cacheClient.del(
      `token:${token}`, `refresh:${token}`
    );
    return result;
  }

  getUri(config) {
    const requestUri = this.client.getUri(config);
    return requestUri;
  }

  // generate a code to use for current request
  newState() {
    return crypto.createHash('sha256')
                 .update(crypto.randomBytes(16))
                 .digest('hex');
  }

  url_stringify(data) {
    return qs.stringify(data);
  }


  // manage new authorization requests
  async authorizeAuth(req, res) {
    // make new authorization request
    const state = this.newState();
    await cacheClient.set('state', state);

    const config = {
      url: '/oauth/authorize',
      params: {
        redirect_uri: this.grantUrl,
        state,
      }
    };
    const authUri = this.getUri(config);
    this.log({
      message: `redirecting to: ${authUri}`, type: 'success',
    });
    return res.redirect(authUri);
  }

  // manage grant requests as authorizeAuth's calback
  async grantAuth(req, res) {
    const validation = validationResult(req);
    if (!validation.array()) {
      return handlers.validationError(validation.array(), res);
    }
    const params = matchedData(req, { locations: ['query'] });
    try {
      const savedState = await cacheClient.get('state');
      const { state, code } = params;
      if (state !== savedState.toString('utf-8')) {
        throw new AuthError(
          'Possible CSRF detected. Unknown state was returned',
          { errno: 401 }
        )
      }
      // clear state and make grant request
      await this.clearState();
      const config = {
        method: 'POST',
        url: '/oauth/grant',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: this.url_stringify({
          code,
          client_id: `${api.id}`,
          client_secret: `${api.secret}`,
          redirect_uri: this.grantUrl,
        }),
        params: {
          grant_type: 'authorization_code',
        }
      };
      try {
        const response = await this.make(config);
        return response;
      } catch (error) {
        throw new AuthError(
          error.message, {
            errno: error.errno < 0 ? error.errno : 401,
            code: error?.code || null,
            stack: null
          }
        );
      }
      return res;
    } catch (error) {
      const resData = {};
      this.setDataHeaders(resData, {
      error, options: {'x-took': error.timeTaken },
      });
      if (error?.errno > 0) {
        this.log({ message: error.message, type: 'error' });
      return res.status(error.errno).send(resData);
    }
      this.setResStatus(error.code, res);
      this.log({ req });
      res.data = resData;
      return res;
    }
  }

  async refreshAuth(req, res) {
    // refresh auth
  }
}

const authClient = new AuthClient();
authClient.init();
export default authClient;

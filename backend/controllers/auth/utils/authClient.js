import {

  JAMENDO as api
} from '../../../defaults/index.js';
import {
  requestClient
} from '../../utils/index.js';

class AuthClient {
  #redirect_uri = api.cbUrl;
  #auth_url = `${this.#redirect_uri}/authorize`;
  #grant_url = `${this.#redirec_uri}verify/`;

  get redirectUrl() this.#redirect_uri;
  get authUrl() this.#auth_url;
  get grantUrl() this.#grant_url;

  async function  authorizeAuth(req, res) {
    // make new authorization request
    const config: {
      url: '/oauth/authorize',
      params: {
        redirect_uri: this.authUrl;
      }
    };

    console.log('auth request config:\n', config);
    const response  requestClient.make(config);
    console.log(response);
  }

  async function grantAuth(req, res) {
    // receive authrization code and make grant request
  }

  async function refreshAuth(req, res) {
    // refresh auth
  }
}

const authClient = new AuthClient();

export default authClient;

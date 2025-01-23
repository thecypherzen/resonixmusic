import {
  JAMENDO as api
} from '../../../defaults/index.js';
import {
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

  getUri(config) {
    const requestUri = this.client.getUri(config);
    return requestUri;
  }


  async authorizeAuth(req, res) {
    // make new authorization request
    const config = {
      url: '/oauth/authorize',
      params: {
        redirect_uri: this.grantUrl,
      }
    };

    const authUri = this.getUri(config);
    this.log({
      message: `redirecting to: ${authUri}`, type: 'success',
    });
    return res.redirect(authUri);
  }

  async grantAuth(req, res) {
    // receive authrization code and make grant request
  }

  async refreshAuth(req, res) {
    // refresh auth
  }
}

const authClient = new AuthClient();
authClient.init();
export default authClient;

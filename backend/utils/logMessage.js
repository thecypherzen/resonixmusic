import {
  COLOURS as colours,
} from '../defaults/index.js';

class MessageLogger {
  #name = 'MessageLogger';
  #colours = {
    error: colours.red,
    success: colours.green,
    info: colours.blue,
    normal: colours.normal,
    warning: colours.yellow,
  };

  get name () {
    return this.#name;
  }

  log ({
    message = null,
    type = 'normal',
    req = null,
    error = null,
  }) {
    let prefix = `${this.#colours[type] || ''}`;
    if (message) {
      console.log(`${prefix}${message}${this.#colours.normal}`);
      return;
    }
    const { method, originalUrl, res } = req;
    if (!error){
      type = res.statusCode < 100 || res.statusCode >= 400
        ? 'error' : res.statusCode < 200
        ? 'info' : res.statusCode < 300
        ? 'success' : 'warning';
    }
    let statusCode;
    if (error && error.errno > 0) {
      statusCode = error.errno;
    } else {
      statusCode = res.statusCode
    }
    prefix = `${this.#colours[type]}`;
    const body = `[${req.method} ${statusCode}] ${originalUrl}`;
    console.log(`${prefix}${body}${this.#colours.normal}`);
    return;
  }

  [Symbol.toStringTag] = this.#name;
  toString () {
    return `[${this[Symbol.toStringTag]}]`;
  }
}

const logger = new MessageLogger();
export default logger;

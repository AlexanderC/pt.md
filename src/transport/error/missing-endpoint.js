const BaseError = require('../../error/base');

class MissingEndpoint extends BaseError {
  /**
   * @param {string} name
   */
  constructor(name) {
    super(`Missing endpoint ${name}`);
  }
}

module.exports = MissingEndpoint;

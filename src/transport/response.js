/* eslint dot-notation: 0 */

const cookie = require('cookie');

class Response {
  /**
   * Axios response object
   * @param {*} rawResponse
   */
  constructor(rawResponse) {
    this.$rawResponse = rawResponse;
    this._customData = null;
  }

  /**
   * Get response status
   */
  get status() {
    const { Location } = this.$rawResponse.headers;

    if (Location && Location.test(Response.ERROR_REGEXP)) {
      return parseInt(Location.replace(Response.ERROR_REGEXP, ''), 10);
    }

    return this.$rawResponse.status;
  }

  /**
   * Set custom data
   * @param {*} data
   */
  set customData(data) {
    this._customData = data;
  }

  /**
   * Get data
   */
  get data() {
    if (this._customData) {
      return this._customData;
    }

    return this.$rawResponse.data && this.$rawResponse.data.data
      ? this.$rawResponse.data.data
      : this.$rawResponse.data;
  }

  /**
   * Get error string
   */
  get error() {
    let error = null;

    if (!this.isRawOk) {
      error = this.$rawResponse.statusText;
    } else if (!this.isOk) {
      error = 'Internal Error'; // @todo Figure out the error response format
    }

    return error;
  }

  /**
   * Check if raw response is ok
   */
  get isRawOk() {
    return this.status < 400;
  }

  /**
   * Check if API response is ok
   */
  get isOk() {
    return this.$rawResponse.data && (
      typeof this.$rawResponse.data === 'string' // HTML page
        || this.$rawResponse.data.success === true // JSON object
    );
  }

  /**
   * Get cookies
   */
  get cookie() {
    return cookie.parse(
      this.$rawResponse.headers['set-cookie'][0]
        || this.$rawResponse.headers['cookie'],
    );
  }

  /**
   * Error RegExp
   */
  static get ERROR_REGEXP() {
    return /^\/Error\//;
  }
}

module.exports = Response;

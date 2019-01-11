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

    return this.$rawResponse.data;
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
      ((this.$rawResponse.headers['set-cookie']
        && this.$rawResponse.headers['set-cookie'][0])
          || this.$rawResponse.headers['cookie']) || '',
    );
  }

  /**
   * Convert response to JSON representation object
   */
  toJSON() {
    const {
      data, status, statusText, headers, config,
    } = this.$rawResponse;

    const {
      isOk, cookie: cookieObj, isRawOk, error, data: processedData, status: processedStatus,
    } = this;

    return {
      raw: {
        data: Response._truncateDataRepr(data),
        status,
        statusText,
        headers,
        config,
      },
      processed: {
        isOk,
        isRawOk,
        error,
        cookie: cookieObj,
        data: Response._truncateDataRepr(processedData),
        status: processedStatus,
      },
    };
  }

  /**
   * Error RegExp
   */
  static get ERROR_REGEXP() {
    return /^\/Error\//;
  }

  /**
   * Truncate data representation
   * @param {*} data
   */
  static _truncateDataRepr(data) {
    if (typeof data === 'string' && data.length > 1000) {
      return data.substr(0, 1000);
    }

    return data;
  }
}

module.exports = Response;

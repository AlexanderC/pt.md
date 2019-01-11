const Request = require('./request');
const MissingEndpoint = require('./error/missing-endpoint');
const debug = require('../helper/debug')(__filename);

class Client {
  /**
   * @param {*} api
   */
  constructor(api) {
    this.api = api;
    this.endpoints = {};
    this.defaults = {};

    debug('api', this.api);
  }

  /**
   * Setup client globals
   * @param {*} options
   */
  setDefaults(options) {
    this.defaults = Object.assign(this.defaults, options);

    debug('defaults', this.defaults);

    return this;
  }

  /**
   * Ensure and endpoint exists
   * @param {string} name
   */
  ensureEndpointExists(name) {
    if (!this.endpointExists(name)) {
      throw new MissingEndpoint(name);
    }
  }

  /**
   * Check if an endpoint exists
   * @param {string} name
   */
  endpointExists(name) {
    return this.api.hasOwnProperty(name);
  }

  /**
   * Reset all endpoints
   */
  resetAllEndpoints() {
    this.endpoints = {};

    return this;
  }

  /**
   * Reset a cached endpoint
   * @param {string} name
   */
  resetEndpoint(name) {
    this.ensureEndpointExists(name);

    delete this.endpoints[name];

    return this;
  }

  /**
   * Create a request to an endpoint
   * @param {string} name
   * @param {...any} args
   */
  async request(name, ...args) {
    this.ensureEndpointExists(name);

    if (!this.endpoints.hasOwnProperty(name)) {
      const request = new Request(name, this.api[name], this.defaults);

      this.endpoints[name] = await request.setup(...args);
    }

    return this.endpoints[name];
  }
}

module.exports = Client;

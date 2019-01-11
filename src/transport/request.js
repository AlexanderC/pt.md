const axios = require('axios');
const merge = require('deepmerge');
const Response = require('./response');
const InvalidResponse = require('./error/invalid-response');
const debug = require('../helper/debug')(__filename);

class Request {
  /**
   * @param {string} name
   * @param {*} config
   * @param {*} defaults
   */
  constructor(name, config, defaults) {
    this.name = name;
    this.config = config;
    this.defaults = defaults;
  }

  /**
   * Send request
   * @param {*} params
   * @param {*} data
   */
  async send(params = {}, data = {}) {
    const options = await this.config.options(merge(this.defaults, this.config), params, data);

    debug(`request:${this.name}`, options);

    let response;

    try {
      response = await axios.request(options);
    } catch (error) {
      throw new InvalidResponse(error.message);
    }

    response = new Response(response);

    if (!response.isOk) {
      throw new InvalidResponse(response.error);
    }

    response = await this.config.process(response);

    debug(`response:${this.name}`, JSON.stringify(response, null, '  '));

    return response;
  }

  /**
   * Setup request
   * @param  {...any} args
   */
  async setup(...args) {
    debug(`setup:${this.name}`, ...args);

    this.config = await this.config.setup(
      this.config,
      ...args,
    );

    debug(`setup:${this.name}:dispatched`, this.config);

    return this;
  }
}

module.exports = Request;

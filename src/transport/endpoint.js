/* eslint quote-props:0, no-restricted-syntax: 0 */

const merge = require('deepmerge');
const qs = require('qs');

module.exports = (extObj) => {
  return merge({
    baseURL: 'https://pt.md',
    headers: {
      'Host': 'pt.md',
      'Origin': 'https://pt.md',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.1 Safari/605.1.15',
    },
    async process(response) {
      return response;
    },
    async setup(defaults, extension) {
      return merge(defaults, extension || {});
    },
    async options(defaults, params, data) {
      const options = merge(defaults, { params, data });

      // Remove generic properties
      delete options.process;
      delete options.setup;
      delete options.options;

      if (options.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        options.data = qs.stringify(options.data);
      }

      return options;
    },
  }, extObj);
};

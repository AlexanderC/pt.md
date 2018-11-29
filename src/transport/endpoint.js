/* eslint quote-props:0, no-restricted-syntax: 0 */

const merge = require('deepmerge');
const FormData = require('form-data');

module.exports = (extObj) => {
  return merge({
    baseURL: 'https://pt.md',
    headers: {
      'Accept-Language': 'en-us',
      'Host': 'pt.md',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.1 Safari/605.1.15',
      'Referer': 'https://pt.md/',
      'Connection': 'keep-alive',
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

      if (options.headers['Content-Type'] === 'multipart/form-data') {
        const form = new FormData();

        for (const key of Object.keys(options.data || {})) {
          form.append(key, options.data[key]);
        }

        // Cleanup junk options
        delete options.headers['Content-Type'];

        options.data = form;
        options.headers = form.getHeaders(options.headers || {});
      }

      return options;
    },
  }, extObj);
};

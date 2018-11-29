/* eslint quotes:0, quote-props:0 */

const merge = require('deepmerge');
const cheerio = require('cheerio');
const endpoint = require('./endpoint');
const Item = require('../entity/item');

module.exports = {
  loginPrerequisites: endpoint({
    method: 'get',
    url: '/Account/Login',
    async process(response) {
      if (response.isOk) {
        const $ = cheerio.load(response.data);
        const verificationTokenInput = $('#main > div > div > div > form > input[name="__RequestVerificationToken"]');
        const { __RequestVerificationToken } = response.cookie;

        response.customData = {
          verificationToken: verificationTokenInput.val(),
          verificationCookie: __RequestVerificationToken,
        };
      }

      return response;
    },
  }),
  login: endpoint({
    method: 'post',
    url: '/Account/Login',
    data: {
      UserName: null,
      Password: null,
      __RequestVerificationToken: null, // This should be set by calling setup()
    },
    headers: {
      'Content-Type': 'multipart/form-data',
      Cookie: '__RequestVerificationToken=null', // This should be set by calling setup()
    },
    async setup(defaults, verificationToken, verificationCookie) {
      return merge(defaults, {
        data: {
          __RequestVerificationToken: verificationToken,
        },
        headers: {
          Cookie: `__RequestVerificationToken=${verificationCookie}`,
        },
      });
    },
  }),
  list: endpoint({
    method: 'get',
    url: '/BeneficiarZone/TransactionJournal/TransactionViewAndPay',
    params: {
      page: 1,
      pageSize: 100,
      param_date: null,
      param_dateTo: null,
    },
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
      'Referer': 'https://pt.md/beneficiarzone/transactionjournal/viewandpay',
    },
    async process(response) {
      response.customData = { total: 0, items: [] };

      if (response.isOk) {
        response.customData = {
          total: response.data.MaxCountData || null,
          items: Array.isArray(response.data.data)
            ? response.data.data.map(data => new Item(data))
            : null,
        };
      }

      return response;
    },
  }),
};

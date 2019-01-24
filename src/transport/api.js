/* eslint quotes:0, quote-props:0 */

const merge = require('deepmerge');
const cheerio = require('cheerio');
const endpoint = require('./endpoint');
const Item = require('../entity/item');

module.exports = {
  'login.1': endpoint({
    method: 'get',
    url: '/Account/Login',
    async process(response) {
      if (response.isOk) {
        const $ = cheerio.load(response.data);
        const verificationTokenInput = $('input[name="__RequestVerificationToken"]');
        const { __RequestVerificationToken } = response.cookie;

        response.customData = {
          verificationToken: verificationTokenInput.val(),
          verificationCookie: __RequestVerificationToken,
        };
      }

      return response;
    },
  }),
  'login.2': endpoint({
    method: 'post',
    url: '/Account/Login',
    data: {
      UserName: null,
      Password: null,
      __RequestVerificationToken: null, // This should be set by calling setup()
    },
    maxRedirects: 0,
    validateStatus(status) {
      return status === 302;
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': '__RequestVerificationToken=null', // This should be set by calling setup()
    },
    async setup(defaults, verificationToken, verificationCookie) {
      return merge(defaults, {
        data: {
          __RequestVerificationToken: verificationToken,
        },
        headers: {
          'Cookie': `__RequestVerificationToken=${verificationCookie}`,
        },
      });
    },
    async process(response) {
      if (response.isOk) {
        response.customData = { aspxauth: response.cookie['.ASPXAUTH'] };
      }

      return response;
    },
  }),
  'login.3': endpoint({
    method: 'get',
    url: '/BeneficiarZone/BHome',
    data: {
      UserName: null,
      Password: null,
      __RequestVerificationToken: null, // This should be set by calling setup()
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': '__RequestVerificationToken=null; .ASPXAUTH=null', // This should be set by calling setup()
    },
    async setup(defaults, verificationToken, verificationCookie, aspxauth) {
      return merge(defaults, {
        data: {
          __RequestVerificationToken: verificationToken,
        },
        headers: {
          'Cookie': `__RequestVerificationToken=${verificationCookie}; .ASPXAUTH=${aspxauth}`,
        },
      });
    },
    async process(response) {
      if (response.isOk) {
        response.customData = { sessionId: response.cookie['ASP.NET_SessionId'] };
      }

      return response;
    },
  }),
  list: endpoint({
    method: 'get',
    url: '/BeneficiarZone/TransactionJournal/TransactionViewAndPay',
    withCredentials: true,
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
    },
    async process(response) {
      response.customData = response.isOk ? {
        total: response.data.MaxCountData || null,
        items: Array.isArray(response.data.data)
          ? response.data.data.map(data => new Item(data))
          : null,
      } : { total: 0, items: [] };

      return response;
    },
  }),
  paymentPage: endpoint({
    method: 'get',
    url: '/BeneficiarZone/TransactionJournal/CardPayOrder',
    withCredentials: true,
    params: {
      id: null,
    },
  }),
};

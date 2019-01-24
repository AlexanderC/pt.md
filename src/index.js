const Client = require('./transport/client');
const api = require('./transport/api');

class Pt {
  /**
   * @param {Client} client
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Authenticate to pos terminal
   * @param {string} username
   * @param {string} password
   */
  async authenticate(username, password) {
    const payload = { UserName: username, Password: password };

    const loginPrerequisites = await this.client.request('login.1');
    const loginPrerequisitesResponse = await loginPrerequisites.send();
    const { verificationToken, verificationCookie } = loginPrerequisitesResponse.data;

    const login = await this.client.request('login.2', verificationToken, verificationCookie);
    const loginResponse = await login.send({}, payload);
    const { aspxauth } = loginResponse.data;

    const postLogin = await this.client.request('login.3', verificationToken, verificationCookie, aspxauth);
    const postLoginResponse = await postLogin.send({}, payload);
    const { sessionId } = postLoginResponse.data;

    this.client.resetAllEndpoints().setDefaults({
      headers: {
        Cookie: [
          `ASP.NET_SessionId=${sessionId}`,
          `.ASPXAUTH=${aspxauth}`,
          `__RequestVerificationToken=${verificationCookie}`,
        ].join('; '),
      },
    });

    return this;
  }

  /**
   * List items
   * @param {Date} fromDate
   * @param {Date} toDate
   * @param {number} page
   * @param {number} pageSize
   */
  async list(fromDate, toDate, page = 1, pageSize = 100) {
    const list = await this.client.request('list');

    const response = await list.send({
      page,
      pageSize,
      param_date: (
        fromDate instanceof Date ? fromDate : new Date(fromDate)
      ).toString(),
      param_dateTo: (
        toDate instanceof Date ? toDate : new Date(toDate)
      ).toString(),
    });

    return response.data;
  }

  /**
   * Get payment page HTML
   * @param {string} orderID
   */
  async paymentPage(orderID) {
    const paymentPage = await this.client.request('paymentPage');

    const response = await paymentPage.send({ id: orderID });

    return response.data;
  }

  /**
   * Create an instance of Pt
   */
  static create() {
    return new this(new Client(api));
  }
}

module.exports = Pt;

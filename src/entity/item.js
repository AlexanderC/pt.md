/* eslint no-restricted-syntax: 0, no-continue: 0 */

const Base = require('./base');
const String = require('../helper/string');

/**
 * @class Item
 * @property {number} rowNum
 * @property {number} orderID
 * @property {Date} orderDate
 * @property {number} orderStateID
 * @property {string} orderStateCode
 * @property {string} orderStateName
 * @property {string} goodsName
 * @property {string} shopCompanyName
 * @property {string} deliveryCompanyName
 * @property {number} invoiceID
 * @property {string} invoiceNumber
 * @property {number} invoicePaymentStateID
 * @property {number} packageWidth
 * @property {number} packageHeight
 * @property {number} packageDepth
 * @property {number} packageWeight
 * @property {number} terminalCode
 * @property {number} moduleCode
 * @property {number} cellCode
 * @property {string} cellCategoryName
 * @property {Date} cellTimeBegin
 * @property {Date} cellTimeEnd
 */
class Item extends Base {
  /**
   * @inheritdoc
   */
  static transform(data) {
    const { OrderDate, CellTimeBegin, CellTimeEnd } = data;

    const customData = Object.assign(data, {
      OrderDate: OrderDate ? new Date(OrderDate) : null,
      CellTimeBegin: CellTimeBegin ? new Date(CellTimeBegin) : null,
      CellTimeEnd: CellTimeEnd ? new Date(CellTimeEnd) : null,
    });

    for (const key of Object.keys(customData)) {
      const normalizedKey = String.lcfirst(key);

      if (normalizedKey === key) {
        continue;
      }

      customData[normalizedKey] = customData[key];
      delete customData[key];
    }

    return customData;
  }

  /**
   * Check if invoice is paid
   */
  get isPaid() {
    return this.invoicePaymentStateID === 12990;
  }

  /**
   * @inheritdoc
   */
  toJSON() {
    const { isPaid } = this;

    return Object.assign({ isPaid }, super.toJSON());
  }
}

module.exports = Item;

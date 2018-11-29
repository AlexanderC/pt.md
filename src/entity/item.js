const Base = require('./base');

/**
 * @class Item
 * @property {number} rowNum
 * @property {number} OrderID
 * @property {Date} OrderDate
 * @property {number} OrderStateID
 * @property {string} OrderStateCode
 * @property {string} OrderStateName
 * @property {string} GoodsName
 * @property {string} ShopCompanyName
 * @property {string} DeliveryCompanyName
 * @property {number} InvoiceID
 * @property {string} InvoiceNumber
 * @property {number} InvoicePaymentStateID
 * @property {number} PackageWidth
 * @property {number} PackageHeight
 * @property {number} PackageDepth
 * @property {number} PackageWeight
 * @property {number} TerminalCode
 * @property {number} ModuleCode
 * @property {number} CellCode
 * @property {string} CellCategoryName
 * @property {Date} CellTimeBegin
 * @property {Date} CellTimeEnd
 */
class Item extends Base {
  /**
   * @inheritdoc
   */
  static transform(data) {
    const { OrderDate, CellTimeBegin, CellTimeEnd } = data;

    return Object.assign(data, {
      OrderDate: OrderDate ? new Date(OrderDate) : null,
      CellTimeBegin: CellTimeBegin ? new Date(CellTimeBegin) : null,
      CellTimeEnd: CellTimeEnd ? new Date(CellTimeEnd) : null,
    });
  }

  /**
   * Check if invoice is paid
   */
  get isPaid() {
    return this.InvoicePaymentStateID === 12990;
  }

  /**
   * Get payment URI
   */
  get paymentUri() {
    return `https://pt.md/BeneficiarZone/TransactionJournal/CardPayOrder?id=${this.OrderID}`;
  }
}

module.exports = Item;

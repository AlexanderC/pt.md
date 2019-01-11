/* eslint no-underscore-dangle:0, no-restricted-syntax: 0 */

class BaseEntity {
  /**
   * @param {*} rawData
   */
  constructor(rawData) {
    this.$rawData = this.constructor.transform(rawData);

    this._assign();
  }

  /**
   * Transform raw data
   * @param {*} data
   */
  static transform(data) {
    return data;
  }

  /**
   * Assign as instance props
   */
  _assign() {
    Object.assign(this, this.$rawData);
  }

  /**
   * JSON representation object
   */
  toJSON() {
    const keys = Object.keys(this.$rawData);
    const result = {};

    for (const key of keys) {
      result[key] = this[key];
    }

    return result;
  }
}

module.exports = BaseEntity;

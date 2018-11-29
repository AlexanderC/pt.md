/* eslint no-underscore-dangle:0 */

class BaseEntity {
  /**
   * @param {*} rawData
   */
  constructor(rawData) {
    this.$rawData = this.transform(rawData);

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
}

module.exports = BaseEntity;

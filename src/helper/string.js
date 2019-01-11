class String {
  /**
   * Lower case first letter
   * @param {string} string
   */
  static lcfirst(string) {
    if (string.length <= 0) {
      return string;
    }

    return string.charAt(0).toLowerCase() + string.slice(1);
  }
}

module.exports = String;

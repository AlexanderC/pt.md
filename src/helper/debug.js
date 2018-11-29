const debug = require('debug');
const path = require('path');
const pkg = require('../../package.json');

module.exports = (filename) => {
  const namespace = path.basename(filename, '.js');

  return (...args) => debug(`${pkg.name}:${namespace}`)(...args);
};

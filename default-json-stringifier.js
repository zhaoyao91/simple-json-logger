const stringify = require('fast-safe-stringify')

module.exports = {
  normal(target) {
    return stringify(target)
  },

  pretty(target) {
    return stringify(target, null, 2)
  }
}

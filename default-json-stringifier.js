module.exports = {
  normal(target) {
    return JSON.stringify(target)
  },

  pretty(target) {
    return JSON.stringify(target, null, 2)
  }
}
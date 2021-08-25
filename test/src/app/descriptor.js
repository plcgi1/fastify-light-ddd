const version = require('./version/descriptor')
const calc = require('./calc/descriptor')

const descriptor = {
  controllers: [
    version,
    calc,
  ]
}

module.exports = descriptor

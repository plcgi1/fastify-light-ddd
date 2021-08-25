const version = require('./version/descriptor')
const calc = require('./calc/descriptor')

const descriptor = {
  rootPath: '/src/app',
  controllers: [
    version,
    calc,
  ]
}

module.exports = descriptor

const fastify = require('fastify')
const fastifyLightDDD = require('../../src')
const descriptor = require('./app/descriptor')
const packageInfo = require('../package')

function build() {
  const app = fastify({ logger: true })

  app.register(fastifyLightDDD, { ...descriptor, packageInfo })

  return app
}

module.exports = build

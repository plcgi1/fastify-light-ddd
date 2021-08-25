const fastify = require('fastify')
const fastifyLightDDD = require('../src')
const descriptor = require('./app/descriptor')

function build() {
  const app = fastify({ logger: true })

  app.register(fastifyLightDDD, descriptor)

  return app
}

module.exports = build

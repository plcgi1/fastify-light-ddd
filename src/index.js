const fp = require('fastify-plugin')
const path = require('path')
const fs = require('fs')

const camelCaseFromHypencase = (str) => {
  return str.replace(/\b-([a-z])/g, (_, char) => char.toUpperCase())
}

function walk(dir) {
  let results = []

  const list = fs.readdirSync(dir)

  list.forEach(function (file) {
    file = dir + '/' + file

    const stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file))
    } else {
      /* Is a file */
      results.push(file)
    }
  })
  return results
}

async function createServices(app, regExp, rootPath) {

  // find all files in app/**/**.service.js
  const services = {}

  walk(path.resolve(rootPath))
    .filter((fullFileName) => regExp.test(fullFileName))
    .map(async (fullfilename) => {
      const parts = fullfilename.split('/')

      const filename = path.basename(fullfilename)

      const requirePath = `${rootPath}/${parts[parts.length - 2]}/${filename}`

      const Service = require(path.resolve(fullfilename))

      const service = new Service()

      const serviceName = camelCaseFromHypencase(`${filename.split('.')[0]}`)

      services[serviceName] = service

      if (services[serviceName].initialize) {
        await services[serviceName].initialize()
      }
    })

  app.addHook('onRequest', (req, res, next) => {
    req.services = services

    next()
  })
  app.decorate('services', services)
}

const createMailers = (app, regExp, rootPath) => {
  const mailers = {}

  walk(path.resolve(rootPath))
    .filter((fullFileName) => regExp.test(fullFileName))
    .map((fullfilename) => {
      const parts = fullfilename.split('/')

      const filename = path.basename(fullfilename)

      const requirePath = `${mailersPath}/${parts[parts.length - 3]}/mailers/${filename}`

      const Mailer = require(path.resolve(requirePath))

      const mailer = new Mailer()

      const mailerName = camelCaseFromHypencase(`${filename.split('.')[0]}`)

      mailers[mailerName] = mailer
    })

  app.addHook('onRequest', (req, res, next) => {
    req.mailers = mailers
    next()
  })
  app.decorate('mailers', mailers)
}

const createControllers = (app, controllers, rootPath) => {
  // find all files in app/**/**.controller.js
  // load files
  // create objects
  // attach objects to app
  controllers.forEach((controllerData) => {
    const controllerPath = `${rootPath}/${controllerData.path}`
    const Controller = require(path.resolve(controllerPath))

    const controller = new Controller()
    const schemaPath = `${rootPath}/${controllerData.schemas}`
    const schemas = controllerData.schemas
      ? require(path.resolve(schemaPath))
      : {}
    const tags = controllerData.tags
    const { interfaces } = controllerData

    interfaces.forEach((interfaceT) => {
      let prehandlers = []

      if (interfaceT.preHandler) {
        prehandlers = interfaceT.preHandler.map((prehandler) => {
          return prehandler(app, controller)
        })
      }
      if (!schemas[interfaceT.controllerMethod]) {
        schemas[interfaceT.controllerMethod] = {}
      }
      if (interfaceT.tags) {
        schemas[interfaceT.controllerMethod].tags = [...tags, ...interfaceT.tags]
      } else {
        schemas[interfaceT.controllerMethod].tags = tags
      }

      schemas[interfaceT.controllerMethod].security = interfaceT.security

      app[interfaceT.httpMethod](
        interfaceT.path,
        {
          preHandler: prehandlers,
          schema: schemas[interfaceT.controllerMethod],
        },
        (req, reply) => {
          return controller[interfaceT.controllerMethod](req, reply, app)
        }
      )
    })
  })
}

function getRootPath (rootPath) {
  if (!rootPath) return './src/app'

  return rootPath
}

const init = async (fastify, config, done) => {
  /*
    config: descriptors
    */
  const { prefixPath, controllers } = config

  const rootPath = getRootPath(prefixPath)

  await createServices(fastify, new RegExp(/\.service\./), rootPath)

  createControllers(fastify, controllers, rootPath)

  createMailers(fastify, new RegExp(/mailers/), rootPath)

  done()
}

module.exports = fp(async (fastify, config, done) => {
  await init(fastify, config, done)
})

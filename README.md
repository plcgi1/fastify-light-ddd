# Fastify plugin with light DDD approach

Lightweight DDD folder structure for fastify server with adding services in automode
 
## Folder description for app - which use the plugin

```
.src/app/*
.src/app/DOMAIN-NAME/descriptor.js - description of controllers 
.src/app/DOMAIN-NAME/some-controller.controller.js - fastify controller
.src/app/DOMAIN-NAME/some-json-schema.schema.js - JSON schema for controller's calls with fastify validation
.src/app/DOMAIN-NAME/some-service.service.js - some service(interact with database, remote service or so on)
.src/app/DOMAIN-NAME/mailers/some-mailer-name.js - service which sends emails
```
## Usage ([./example](./example))

```js
// server.js
const app = require('./src/app')

const port = 8080

const start = async () => {
  let server
  try {
    server = await app()
    await server.listen(port)
    console.info('Server started', port)
  } catch (error) {
    console.error('ERRRRRRR', error)
  }
}
start()

// src/app.js
const fastifyLightDDD = require('fastify-light-ddd')
const descriptor = require('./app/descriptor')

function build() {
  const app = fastify({ logger: true })

  app.register(fastifyLightDDD, descriptor)

  return app
}

module.exports = build

```


## Descriptors format

```js
{
    rootPath: "prefix folder for app domain, default '/src/app'"
    controllers: [
      {
          name: 'name of service', // required
          path: 'path to controller(ex: ./version/version.controller.js)', // required
          tags: ['default'], // tags for JSON schema or for swagger
          interfaces: [
            {
              httpMethod: 'get', // can be get|post|patch|put|delete, required
              controllerMethod: 'get', // controller's method for call, required
              path: '/api/version', // HTTP path in url for controller's method, required
              preHandler: [], // fastify handlers - https://www.fastify.io/docs/v3.3.x/Routes/
              security: [ // optional
                  {
                    apiKey: [],
                  },
              ],
            },
          ],
      }
    ]
}
```

## Howto (see [./example](./example))

### Add new remote method to app

1. Mkdir ./src/app/animals
2. Add ./src/app/animals/descriptor.js
3. Add ./src/app/animals/animals.controller.js
4. Add ./src/app/animals/animals.schema.js
5. Add ./src/app/animals/animals.service.js - optional
6. Add ./src/app/animals/animals/mailers/sendMyEmails.js - optional
7. Restart the server

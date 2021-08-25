const http = require('http')
const test = require('tap').test
const plugin = require('../src')
const fastify = require('fastify')
const descriptors = {
  prefixPath: './test',
  controllers: [
    {
      name: 'version',
      path: './src/app/version/version.controller',
      tags: ['default'],
      interfaces: [
        {
          httpMethod: 'get',
          controllerMethod: 'get',
          path: '/api/version',
          preHandler: [],
        },
      ],
    }
  ]
}

test('plugin get added', (t) => {
  t.plan(1)
  const instance = fastify()
  instance.register(plugin, descriptors)

  instance.listen(0, (err) => {
    if (err) t.threw(err)

    instance.server.unref()

    const portNum = instance.server.address().port
    const address = `http://127.0.0.1:${portNum}/api/version`

    http.get(address, (res) => {
      t.ok(res.statusCode === 200)
    })
      .on('error', (err) => t.threw(err))
  })
})

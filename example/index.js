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

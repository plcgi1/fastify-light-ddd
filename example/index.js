const app = require('./src/app')
const { port } = require('./config/environment')

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

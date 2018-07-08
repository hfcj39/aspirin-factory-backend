const Koa = require('koa')
const config = require('./src/configs')
const installRoutes = require('./src')

const cmd = (process.argv[2] || 'RUNSERVER').toUpperCase()

switch (cmd) {
    case 'TEST':
        break
    case 'RUNSERVER':
    default:
        const app = new Koa()

        installRoutes(app).listen(config.server.port, '0.0.0.0')

        console.log(`start ${config.server.name} on ${config.server.port}`)
}

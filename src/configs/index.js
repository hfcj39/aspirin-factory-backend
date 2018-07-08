// 开发部署环境
const DevelopmentConfig = require('./dev.js')

// 提测部署环境
const TestConfig = require('./test.js')

// 上线部署环境
const ProductionConfig = require('./prod.js')

console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV || 'development'}`)

switch (process.env.NODE_ENV) {
  case 'production':
    module.exports = global.config = new ProductionConfig()
    break
  case 'test':
    module.exports = global.config = new TestConfig()
    break
  case 'development':
    module.exports = global.config = new DevelopmentConfig()
    break
  default:
    module.exports = global.config = new DevelopmentConfig()
    break
}

module.exports = global.config = config

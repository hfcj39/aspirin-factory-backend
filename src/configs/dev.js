class DevelopmentConfig {
  constructor() {
    this.server = {
      name: 'factory',
      port: 8777,
    }
    this.db = {
      database: 'database',
      username: null,
      password: null,
      host: 'localhost',
      port: 3306,
      storage: 'database.db',
      dialect: 'sqlite',
      poolSize: 10,
    }
  }

}

module.exports = DevelopmentConfig

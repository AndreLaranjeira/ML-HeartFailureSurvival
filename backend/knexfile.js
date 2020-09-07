// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host : process.env.DEVELOPMENT_DB_HOST,
      user : process.env.DEVELOPMENT_DB_USERNAME,
      password : process.env.DEVELOPMENT_DB_PASSWORD,
      database : 'HEART_FAILURE_D'
    },
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },

  test: {
    client: 'mysql2',
    connection: {
      host : process.env.TEST_DB_HOST,
      user : process.env.TEST_DB_USERNAME,
      password : process.env.TEST_DB_PASSWORD,
      database : 'HEART_FAILURE_T'
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/test'
    },
    useNullAsDefault: true
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};

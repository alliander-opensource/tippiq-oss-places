const path = require('path');

module.exports = {
  client: 'pg',
  connection: process.env.TIPPIQ_PLACES_DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.resolve(__dirname, './api/migrations'),
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: path.resolve(__dirname, './api/seeds'),
  },
};

exports.up = function up(knex, Promise) {
  return Promise.all([
    knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'),
  ]);
};

exports.down = function up(knex, Promise) {
  return Promise.all([
    knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"'),
  ]);
};

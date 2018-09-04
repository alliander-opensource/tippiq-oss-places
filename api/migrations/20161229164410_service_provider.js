exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.table('service_provider', t => {
      t.dropColumn('url')
    }),
    knex.schema.table('service_provider', t => {
      t.json('content')
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.table('service_provider', t => {
      t.string('url')
    }),
    knex.schema.table('service_provider', t => {
      t.dropColumn('content')
    }),
  ]);

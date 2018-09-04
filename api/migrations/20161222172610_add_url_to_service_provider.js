exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.table('service_provider', t => {
      t.string('url')
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.table('service_provider', t => {
      t.dropColumn('url')
    }),
  ]);

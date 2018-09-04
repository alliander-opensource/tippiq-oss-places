exports.up = (knex, Promise) =>
  Promise.all([
    knex.table('policy').update('service_provider', knex.raw('cast(service_id as uuid)')),
    knex.schema.table('policy', t => {
      t.dropColumn('service_id')
    }),
    knex.schema.table('policy', t => {
      t.renameColumn('service_provider', 'service_provider_id');
    })
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.table('policy', t => {
      t.string('service_id')
    }),
    knex.schema.table('policy', t => {
      t.renameColumn('service_provider_id', 'service_provider');
    }),
    knex.table('policy').update('service_id', knex.raw('service_provider')),
  ]);

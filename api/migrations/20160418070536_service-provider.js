exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('service_provider', function (t) {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.string('name').notNull();
      t.text('logo_image').nullable();
      t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
      t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
    }),
    knex.schema.table('oauth2_client', t => {
      t.uuid('owner_id').nullable();
      t.string('owner_type', 64).nullable();
    }),
  ])
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('service_provider'),
    knex.schema.table('oauth2_client', t => {
      t.dropColumns(['owner_id', 'owner_type']);
    }),
  ])
};

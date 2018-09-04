exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable('user', function (t) {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('tippiq_id');
    t.uuid('place').notNull().references('place.id');
    t.string('role').notNull();
    t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
    t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTable('user'),
]);

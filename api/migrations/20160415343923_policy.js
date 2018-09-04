exports.up = function up(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('policy', function (t) {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.string('user_id').notNull();
      t.string('service_id').notNull();
    }),
  ]);
};

exports.down = function down(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('policy'),
  ]);
};

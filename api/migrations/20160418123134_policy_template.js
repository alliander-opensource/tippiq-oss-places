exports.up = function up(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('policy_template', function (t) {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.string('service_id').notNull();
      t.string('slug').nullable();
      t.string('actor_label').nullable();
      t.string('action_label').nullable();
      t.string('actee_label').nullable();
      t.json('conditions').nullable();
      t.string('title').nullable();
      t.text('description').nullable();
      t.uuid('service_provider').references('service_provider.id');
      t.boolean('critical').nullable();
      t.string('critical_disable_warning').nullable();
      t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
      t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
    }),
  ]);
};

exports.down = function down(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('policy_template'),
  ]);
};

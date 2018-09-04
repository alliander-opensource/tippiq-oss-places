exports.up = function up(knex, Promise) {
  return Promise.all([
    knex.schema.table('policy', t => {
      t.string('template_slug').nullable();
      t.string('actor_label').nullable();
      t.string('action_label').nullable();
      t.string('actee_label').nullable();
      t.json('conditions').nullable();
      t.string('description').nullable();
      t.uuid('service_provider').references('service_provider.id');
      t.boolean('critical').nullable();
      t.string('critical_disable_warning').nullable();
      t.text('signature').nullable();
      t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
      t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
    }),
  ]);
};

exports.down = function down(knex, Promise) {
  return Promise.all([
    knex.schema.table('policy', t => {
      t.dropColumns([
        'template_slug',
        'actor_label',
        'action_label',
        'actee_label',
        'conditions',
        'description',
        'service_provider',
        'critical',
        'critical_disable_warning',
        'signature',
        'created_at',
        'updated_at',
      ]);
    }),
  ]);
};

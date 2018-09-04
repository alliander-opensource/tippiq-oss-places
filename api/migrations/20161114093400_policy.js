exports.up = function up(knex, Promise) {
  return Promise.all([
    knex.schema.table('policy', t => {
      t.uuid('place_id').notNull().references('place.id');
    }),
  ]);
};

exports.down = function down(knex, Promise) {
  return Promise.all([
    knex.schema.table('policy', t => {
      t.dropColumns([
        'place_id',
      ]);
    }),
  ]);
};

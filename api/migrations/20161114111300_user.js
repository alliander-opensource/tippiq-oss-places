exports.up = function up(knex, Promise) {
  return Promise.all([
    knex.schema.table('user', t => {
      t.renameColumn('place', 'place_id');
    }),
  ]);
};

exports.down = function down(knex, Promise) {
  return Promise.all([
    knex.schema.table('user', t => {
      t.renameColumn('place_id', 'place');
    }),
  ]);
};

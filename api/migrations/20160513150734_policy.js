exports.up = function up(knex, Promise) {
  return Promise.all([
    knex.schema.table('policy', t => {
      t.renameColumn('description', 'title');
    }),
    knex.schema.table('policy', t => {
      t.text('description').nullable();
    }),
  ]);
};

exports.down = function down(knex, Promise) {
  return Promise.all([
    knex.schema.table('policy', t => {
      t.dropColumn('description');
    }),
    knex.schema.table('policy', t => {
      t.renameColumn('title', 'description');
    }),
  ]);
};

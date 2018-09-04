exports.up = (knex) =>
  knex.schema.table('place', t => {
    t.text('private_key').notNull().defaultTo('');
    t.text('public_key').notNull().defaultTo('');
  });

exports.down = (knex) =>
  knex.schema.table('place', t => {
    t.dropColumns([
      'private_key',
      'public_key',
    ]);
  });

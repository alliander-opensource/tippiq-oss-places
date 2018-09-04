exports.up = (knex) => {
  return knex.schema.renameTable('user', 'user_place_role');
};

exports.down = (knex) => {
  return knex.schema.renameTable('user_place_role', 'user');
};

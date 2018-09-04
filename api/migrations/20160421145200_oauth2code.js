exports.up = function up(knex, Promise) {
  return Promise.all([
    knex.schema.raw('alter table oauth2_authorization_code alter column redirect_uri drop not null')
  ]);
};

exports.down = function up(knex, Promise) {
  return Promise.all([
    knex.table('oauth2_authorization_code').update({'redirect_uri': 'now'}).whereNull('redirect_uri'),
    knex.schema.raw('alter table oauth2_authorization_code alter column redirect_uri set not null'),
  ]);
};

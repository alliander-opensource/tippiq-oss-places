const addConstraint = (knex, table, column, fTable, fColumn) =>
  knex.schema.raw(`ALTER TABLE ?? ADD CONSTRAINT ?? FOREIGN KEY (??) REFERENCES ??(??)`, [
    table, `${table}_${column}`, column, fTable, fColumn,
  ]);
const dropConstraint = (knex, table, column) =>
  knex.schema.raw(`ALTER TABLE ?? DROP CONSTRAINT ??`, [table, `${table}_${column}`,]);
const setNotNull = (knex, table, column) =>
  knex.schema.raw('ALTER TABLE ?? ALTER COLUMN ?? SET NOT NULL', [table, column]);

const updateFrom = (knex, table, column, fTable, setColumn, matchColumn) =>
  knex.schema.raw('UPDATE ?? SET ?? = f.?? FROM ?? f WHERE ?? = f.??', [
    table, column, setColumn, fTable, column, matchColumn,
  ]);


const upUserId = (knex, table, column, fTable, setColumn, matchColumn) =>
  updateFrom(knex, table, column, fTable, setColumn, matchColumn)
    .then(() => addConstraint(knex, table, column, fTable, setColumn));

const upClientId = (knex, Promise, table) =>
  knex.schema.table(table, t => {
    t.renameColumn('client_id', 'client_id_text');
  })
    .then(() =>
      knex.schema.table(table, t => {
        t.uuid('client_id').nullable();
      }))
    .then(() => knex(table).update('client_id', knex.raw('??::uuid', ['client_id_text'])))
    .then(() => setNotNull(knex, table, 'client_id'))
    .then(() => addConstraint(knex, table, 'client_id', 'service_provider', 'id'))
    .then(() => knex.schema.table(table, t => {
      t.dropColumn('client_id_text');
    }));

const downUserId = (knex, table, column, fTable, setColumn, matchColumn) =>
  dropConstraint(knex, table, column)
    .then(() => updateFrom(knex, table, column, fTable, setColumn, matchColumn));

const downClientId = (knex, Promise, table) =>
  dropConstraint(knex, table, 'client_id')
    .then(() => knex.schema.table(table, t => {
      t.renameColumn('client_id', 'client_id_text');
    }))
    .then(() => knex.schema.table(table, t => {
      t.string('client_id').nullable();
    }))
    .then(() => knex(table).update('client_id', knex.raw('??::varchar', ['client_id_text'])))
    .then(() => setNotNull(knex, table, 'client_id'))
    .then(() => knex.schema.table(table, t => {
      t.dropColumn('client_id_text');
    }));

exports.up = (knex, Promise) => Promise.all([
  upUserId(knex, 'oauth2_access_token', 'user_id', 'user_place_role', 'id', 'tippiq_id'),
  upUserId(knex, 'oauth2_authorization_code', 'user_id', 'user_place_role', 'id', 'tippiq_id'),
  upClientId(knex, Promise, 'oauth2_access_token'),
  upClientId(knex, Promise, 'oauth2_authorization_code'),
]);

exports.down = (knex, Promise) => Promise.all([
  downUserId(knex, 'oauth2_access_token', 'user_id', 'user_place_role', 'tippiq_id', 'id'),
  downUserId(knex, 'oauth2_authorization_code', 'user_id', 'user_place_role', 'tippiq_id', 'id'),
  downClientId(knex, Promise, 'oauth2_access_token'),
  downClientId(knex, Promise, 'oauth2_authorization_code'),
]);

exports.up = (knex, Promise) =>
  Promise
    .all([
    knex.schema.table('service_provider', t => {
      t.dropColumn('logo_image');
      t.string('brand_color').nullable();
      t.binary('logo').nullable();
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.table('service_provider', t => {
      t.string('logo_image').nullable();
      t.dropColumns(['brand_color','logo']);
    }),
  ]);

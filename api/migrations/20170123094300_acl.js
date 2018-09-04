exports.up = (knex, Promise) =>
  Promise.all([
    knex('permission')
      .insert([
        { name: 'add_place', label: 'Add place' },
        { name: 'get_place', label: 'Get place' },
        { name: 'delete_place', label: 'Delete place' },
        { name: 'get_place_services', label: 'Get place services' },
        { name: 'get_user_place_roles', label: 'Get user place roles' },
      ]),
  ]).then(() =>
    knex('role_permission').insert([
      { role: 'authenticated', permission: 'add_place' },
      { role: 'owner', permission: 'get_place' },
      { role: 'owner', permission: 'delete_place' },
      { role: 'owner', permission: 'get_place_services' },
      { role: 'owner', permission: 'get_place_services' },
      { role: 'owner', permission: 'get_user_place_roles' },
    ])
  );

exports.down = knex =>
  Promise.all([
    knex('role_permission').where({ permission: 'add_place' }).del(),
    knex('role_permission').where({ permission: 'get_place' }).del(),
    knex('role_permission').where({ permission: 'delete_place' }).del(),
    knex('role_permission').where({ permission: 'get_place_services' }).del(),
    knex('role_permission').where({ permission: 'get_user_place_roles' }).del(),
  ]).then(() =>
    Promise.all([
      knex('permission').where({ name: 'add_place' }).del(),
      knex('permission').where({ name: 'get_place' }).del(),
      knex('permission').where({ name: 'delete_place' }).del(),
      knex('permission').where({ name: 'get_place_services' }).del(),
      knex('permission').where({ name: 'get_user_place_roles' }).del(),
    ])
  );

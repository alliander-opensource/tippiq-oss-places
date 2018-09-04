exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('role', t => {
      t.string('name').primary();
      t.string('label');
    }).then(() =>
      knex('role')
        .insert([
          { name: 'anonymous', label: 'Anonymous' },
          { name: 'authenticated', label: 'Authenticated' },
          { name: 'owner', label: 'Owner' },
        ])
    ).then(() =>
      knex.schema.createTable('permission', t => {
        t.string('name').primary();
        t.string('label');
      })
    ).then(() =>
      knex('permission')
        .insert([
          { name: 'get_all_policy_templates', label: 'Get All Policy Tempates' },
          { name: 'get_service_provider', label: 'Get Service Provider' },
          { name: 'add_policy', label: 'Add Policy' },
          { name: 'delete_policy', label: 'Delete Policy' },
          { name: 'get_all_policies', label: 'Get All Policies' },
          { name: 'get_policy', label: 'Get Policy' },
          { name: 'update_policy', label: 'Update Policy' },
        ])
    ).then(() =>
      knex.schema.createTable('role_permission', t => {
        t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        t.string('role').notNull().references('role.name');
        t.string('permission').notNull().references('permission.name');
      })
    ).then(() =>
      knex('role_permission')
        .insert([
          { role: 'anonymous', permission: 'get_all_policy_templates' },
          { role: 'anonymous', permission: 'get_service_provider' },
          { role: 'owner', permission: 'add_policy' },
          { role: 'owner', permission: 'delete_policy' },
          { role: 'authenticated', permission: 'get_all_policies' },
          { role: 'owner', permission: 'get_policy' },
          { role: 'owner', permission: 'update_policy' },
        ])
    ).then(() =>
      knex.schema.createTable('user_role', t => {
        t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        t.uuid('user').notNull();
        t.string('role').notNull().references('role.name');
      })
    ),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('user_role')
      .then(() => knex.schema.dropTable('role_permission'))
      .then(() => knex.schema.dropTable('permission'))
      .then(() => knex.schema.dropTable('role')),
  ]);

exports.seed = knex =>
  knex('user_place_role').insert([{
    id: 'ef87ab64-a290-4c06-afad-71cc922fc111',
    tippiq_id: '90c7c881-4b85-4d84-8867-f52e89525d76',
    place_id: 'fd1a072c-f8d7-415b-9561-c8f003ba5bbd',
    role: 'place_admin',
  }]);

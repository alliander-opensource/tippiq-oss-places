exports.seed = knex =>
  knex('oauth2_client').insert([{
    id: '6ed5edce-c239-4efb-aefc-c825844c946d',
    client_id: '94297b2a-85e4-402c-99b6-4437f468b7fa',
    client_secret: 'tpq',
  }, {
    id: 'c0eccce2-025d-11e7-8998-5f03162183a1',
    client_id: 'cd5d0352-000f-11e7-8a3f-af612ece5c73',
    client_secret: 'raJoh0eifooquoh0laisahLae',
  }]);

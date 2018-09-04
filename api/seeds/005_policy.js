exports.seed = knex =>
  knex('policy').insert([{
    id: 'bc71fec0-48c9-42fc-87e7-789e2e2a36eb',
    user_id: '90c7c881-4b85-4d84-8867-f52e89525d76',
    service_provider_id: '94297b2a-85e4-402c-99b6-4437f468b7fa',
    template_slug: 'tippiq_Tippiq_place_tippiq_location',
    place_id: 'fd1a072c-f8d7-415b-9561-c8f003ba5bbd',
    title: 'Tippiq mag mijn locatie gebruiken om lokale informatie te tonen',
    description: 'Sta het ophalen van mijn locatiegegevens toe',
    critical: false,
    critical_disable_warning: 'Foutje',
  }, {
    id: 'c4e2ff91-1451-4fc1-953c-5042fb552768',
    user_id: '90c7c881-4b85-4d84-8867-f52e89525d76',
    service_provider_id: '94297b2a-85e4-402c-99b6-4437f468b7fa',
    template_slug: 'tippiq_Tippiq_hood_tippiq_newsletter',
    place_id: 'fd1a072c-f8d7-415b-9561-c8f003ba5bbd',
    title: 'Tippiq mag mijn e-mailadres gebruiken om een Buurtbericht te sturen',
    description: 'Sta het sturen van het huisbericht toe',
    critical: false,
    critical_disable_warning: 'Foutje',
  }]);

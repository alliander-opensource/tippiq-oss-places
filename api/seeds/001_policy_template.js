exports.seed = knex =>
  knex('policy_template').insert([{
    id: 'c33132a0-f685-4ecd-a53a-3277f883654b',
    service_provider_id: '94297b2a-85e4-402c-99b6-4437f468b7fa',
    slug: 'tippiq_Tippiq_place_tippiq_location',
    title: 'Tippiq mag mijn locatie gebruiken om lokale informatie te tonen',
    description: 'Sta het ophalen van mijn locatiegegevens toe',
    critical: false,
    critical_disable_warning: 'Foutje',
  }, {
    id: 'c33132a0-f685-4ecd-a53a-3277f883654c',
    service_provider_id: '94297b2a-85e4-402c-99b6-4437f468b7fa',
    slug: 'tippiq_Tippiq_hood_tippiq_newsletter',
    title: 'Tippiq mag mijn e-mailadres gebruiken om een Buurtbericht te sturen',
    description: 'Sta het sturen van het huisbericht toe',
    critical: false,
    critical_disable_warning: 'Foutje',
  }, {
    id: '25234cfa-3f3a-4ff3-9f7a-8116c05a4315',
    service_provider_id: 'cd5d0352-000f-11e7-8a3f-af612ece5c73',
    slug: 'reference3p_test_policy',
    title: 'Reference 3p mag testdata van mij ophalen.',
    description: 'Bedoeld om te testen of de huisregels werken voor reference-3p.',
    critical: true,
    critical_disable_warning: 'Zonder deze toestemming kan Reference 3p deze dienst niet leveren.',
  }]);

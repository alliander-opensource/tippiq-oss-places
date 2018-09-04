exports.seed = knex =>
  knex('attribute').insert([{
    id: '24070de9-f460-4978-a5de-f60ba62b2301',
    place_id: 'fd1a072c-f8d7-415b-9561-c8f003ba5bbd',
    type: 'tippiq_Tippiq_place_tippiq_location',
    data: '{"attributeType":"tippiq_Tippiq_place_tippiq_location","streetName":"Wilhelminastraat","nr":"1","addition":"","letter":"","cityName":"Haarlem","zipcodeDigits":"2011","zipcodeLetters":"VJ","municipalityName":"Haarlem","provinceName":"Noord-Holland","geometry":{"type":"Point","coordinates":[4.62812976096631,52.3802715641463]},"type":"HouseAddress"}',
  }]);

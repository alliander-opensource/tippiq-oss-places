const fs = require('fs');

exports.seed = knex =>
  knex('service_provider').insert([
    {
      id: '94297b2a-85e4-402c-99b6-4437f468b7fa',
      name: 'Tippiq Buurt',
      brand_color: 'FFFFFF',
      logo: fs.readFileSync('api/seeds/tippiq-buurt-logo.png'),
      content: '{"serviceTitle": "Tippiq buurt", "serviceLink": "http://localhost:3007", "registerLink":"http://localhost:3001/selecteer-je-huis?clientId=94297b2a-85e4-402c-99b6-4437f468b7fa&placeId={{placeId}}&redirect_uri=http://localhost:3007/mijn-buurt", "popup":{"header":"Jouw buurt in 1 overzicht","body":"<p>Met Tippiq buurt ontvang je de buurtinformatie die jij wilt. In het Buurtoverzicht en in je Buurtbericht vind je het laatste buurtnieuws en ben je altijd voorbereid op werkzaamheden, kun je jouw buur een handje helpen of vertrouwd een auto huren voor weinig.</p><p>Je krijgt handige en belangrijke informatie te zien van onze partners. En weet je precies wat er rond jouw huis gebeurt, gevraagd en aangeboden wordt.</p>","image":"https://s3-eu-west-1.amazonaws.com/nl.tippiq.all.assets/Tippiq-buurt-overview.png","moreInfoLink":"https://buurt.tippiq.nl"}}',
    },
    {
      id: '4301e9e8-de4a-4ff0-a110-ff8463ff3fc2',
      name: 'Digitaal aanbellen',
      brand_color: 'FFFFFF',
      logo: fs.readFileSync('api/seeds/3p.png'),
      content: '{"serviceTitle": "Digitale ja/nee sticker", "inDevelopment": "true", "popup":{"header":"Altijd en overal weten wie er bij je aanbelt","body":"<p>Daarnaast kun je ook in contact komen met degene die aanbelt, zelfs zonder dat je de deur opendoet. Wel zo handig als je een pakketje verwacht, vertel de postbode gewoon waar hij het pakketje het best kan afleveren! Of andersom: de postbode kan jou vast een headsup geven, zo weet je nog preciezer wanneer deze komt.  Bovendien is digitaal aanbellen veilig want wist je dat 80% van de inbrekers eerst aanbelt?</p>", "moreInfoLink":"https://tippiq.nl"}}',
    },
    {
      id: '59f6e08f-5c9e-43e2-9f77-914e67fd0232',
      name: '112alert',
      brand_color: 'FFFFFF',
      logo: fs.readFileSync('api/seeds/112Alert.png'),
      content: '{"serviceTitle": "Alarm bij calamiteiten", "inDevelopment": "true", "popup":{"header":"Brand sneller en beter onder controle","body":"<p>Je moet er niet aan denken dat het jou overkomt, maar jaarlijks zijn er 138.000 brandmeldingen in Nederland. Dat zijn er bijna 400 per dag. Als er een brand plaats vindt, dan worden de alarmdiensten gewaarschuwd. Jij ontvangt gelijk een sms als dit gebeurt. En de brandweer weet in één oogopslag wie er woont (inclusief huisdieren), en of er bijzondere of extra brandbare stoffen in het huis aanwezig zijn.</p>", "moreInfoLink":"https://buurt.tippiq.nl"}}',
    },
    {
      id: 'cd5d0352-000f-11e7-8a3f-af612ece5c73',
      name: 'Reference 3P',
      brand_color: 'FFFFFF',
      logo: fs.readFileSync('api/seeds/3p.png'),
      content: '{"serviceTitle": "Reference 3p", "inDevelopment": "true", "popup":{"header":"Reference 3p","body":"<p>Test waarmee nieuwe diensten hun aansluiting kunnen testen.</p>"}}',
    }]);

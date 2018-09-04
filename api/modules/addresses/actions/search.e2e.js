import { app, expect, request, interceptAdresses } from '../../../common/test-utils';
import config from '../../../config';

describe('Address search', () => {
  before(() => {
    interceptAdresses(config.tippiqAddressesBaseUrl);
  });

  it('should exist', () =>
    request(app)
      .get('/addresses/search?query=ams')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
        expect(res.body[0]).to.have.property('geometry');
      })
  );
});


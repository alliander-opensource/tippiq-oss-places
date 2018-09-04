import { app, expect, request } from '../../../common/test-utils';
import config from '../../../config';

describe('Get config', () => {
  it('should exist', () =>
    request(app)
      .get('/config')
      .set('Accept', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body).to.have.property('tippiqIdBaseUrl', config.tippiqIdBaseUrl);
        expect(res.body).to.have.property('frontendBaseUrl', config.frontendBaseUrl);
        expect(res.body).to.have.property('landingBaseUrl', config.landingBaseUrl);
        expect(res.body).to.have.property('privacyUrl', config.privacyUrl);
      })
  );
});


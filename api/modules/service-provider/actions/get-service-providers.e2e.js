import { app, expect, request } from '../../../common/test-utils';

const API_GET_SERVICE_PROVIDER_URL = '/service-provider';

describe('Get service providers', () => {
  it('get all service providers', () =>
    request(app)
      .get(API_GET_SERVICE_PROVIDER_URL)
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of.at.least(1))
  );
});

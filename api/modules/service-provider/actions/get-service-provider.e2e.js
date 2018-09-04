import { app, expect, request } from '../../../common/test-utils';

const API_GET_SERVICE_PROVIDER_URL = '/service-provider';

const clientId = 'c63d545a-0633-11e6-b686-bb1d47039b65';

describe('Get service provider', () => {
  it('return service provider info', () =>
    request(app)
      .get(`${API_GET_SERVICE_PROVIDER_URL}/${clientId}`)
      .expect(200)
      .expect(res => expect(res.body.name).to.equal('Fake Third Party'))
      .expect(res => expect(res.body).to.have.property('logo'))
      .expect(res => expect(res.body.brandColor).to.equal('ff876a'))
  );
});

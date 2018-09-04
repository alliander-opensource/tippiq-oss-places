import jwt from 'jsonwebtoken';
import { request, app, expect, getSignedJwt } from '../../../common/test-utils';
import { PlaceRepository } from '../../places/repositories';
import validPolicy from '../../../testdata/valid-policy';
import ServerMock from '../../../common/server-mock';
import config from '../../../config';
import quickLocationAttribute from '../../../testdata/quick-location-attribute';

describe('Adding a place', () => {
  const placeAddress = {
    ...quickLocationAttribute.data,
  };
  config.tippiqIdBaseUrl = 'http://localhost:13001';

  const tippiqIdMockServer = new ServerMock({ port: 13001 });
  let authToken;

  before('Get Tippiq-ID token', () => getSignedJwt({
    sub: validPolicy.userId,
    action: 'tippiq-id.login_session',
  }).then((token) => {
    authToken = token;
  }));

  before('mock server', () => tippiqIdMockServer.start());
  after('mock server', () => tippiqIdMockServer.stop());

  const deletePlaceAfterTest = placeToken => {
    const placeId = jwt.decode(placeToken).placeId;
    after('place', () => PlaceRepository.deleteById(placeId));
  };

  it('should add a place and return a token', () =>
    request(app)
      .post('/places')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201)
      .expect(res => expect(res.body).to.have.property('placeToken'))
      .expect(res => deletePlaceAfterTest(res.body.placeToken))
  );

  it('should add a place with location attribute and return a token', () =>
    request(app)
      .post('/places')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ placeAddress })
      .expect(201)
      .expect(res => expect(res.body).to.have.property('placeToken'))
      .expect(res => deletePlaceAfterTest(res.body.placeToken))
  );
});

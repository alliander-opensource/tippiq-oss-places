import { app, expect, request, getSignedJwt } from '../../../common/test-utils';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import validUserPlaceRole from '../../../testdata/valid-user-place-role';
import validPolicy from '../../../testdata/valid-policy';
import validPlace from '../../../testdata/valid-place';
import { PlaceRepository } from '../../places/repositories';
import ServerMock from '../../../common/server-mock';
import config from '../../../config';

describe('Get policy', () => { // eslint-disable-line max-statements
  config.tippiqIdBaseUrl = 'http://localhost:13001';
  const userPlaceRole = validUserPlaceRole();

  const tippiqIdMockServer = new ServerMock({ port: 13001 });
  let authToken;

  before(() => getSignedJwt({ sub: validPolicy.userId }).then((token) => {
    authToken = token;
  }));

  before('mock server', () => tippiqIdMockServer.start());
  after('mock server', () => tippiqIdMockServer.stop());

  let policyUrl;
  let placeUrl;
  let placeId;

  before('place', () =>
    PlaceRepository
      .create(validPlace)
      .tap(place => {
        placeId = place.get('id');
        placeUrl = `/places/${place.get('id')}`;
        userPlaceRole.tippiqId = validPolicy.userId;
        userPlaceRole.placeId = placeId;
      })
  );

  before(done => {
    request(app)
      .post(`${placeUrl}/policies?clientId=c63d545a-0633-11e6-b686-bb1d47039b65`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send(validPolicy)
      .end((err, res) => {
        policyUrl = res.headers.location;
        return err ? done(err) : done();
      });
  });

  before('create user-place-role', () => UserPlaceRoleRepository.create(userPlaceRole));

  after('policyUrl', () =>
    request(app)
      .del(policyUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
  );

  after('place', () =>
    request(app)
      .del(placeUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
  );

  it('should include all the values', () =>
    request(app)
      .get(policyUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('userId', validPolicy.userId);
        expect(res.body).to.have.property('serviceProviderId', validPolicy.serviceProviderId);
        expect(res.body).to.have.property('placeId', placeId);
        expect(res.body).to.have.property('templateSlug');
        expect(res.body).to.have.property('actorLabel');
        expect(res.body).to.have.property('actionLabel');
        expect(res.body).to.have.property('acteeLabel');
        expect(res.body).to.have.property('conditions');
        expect(res.body).to.have.property('description');
        expect(res.body).to.have.property('criticalDisableWarning');
        expect(res.body).to.have.property('signature');
        return true;
      })
  );
});

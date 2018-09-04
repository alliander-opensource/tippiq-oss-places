import { app, request, getSignedJwt } from '../../../common/test-utils';
import { PlaceRepository } from '../../places/repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import validUserPlaceRole from '../../../testdata/valid-user-place-role';
import validPolicy from '../../../testdata/valid-policy';
import validPlace from '../../../testdata/valid-place';
import ServerMock from '../../../common/server-mock';
import config from '../../../config';

const clientId = 'c63d545a-0633-11e6-b686-bb1d47039b65';

describe('Delete policy', () => { // eslint-disable-line max-statements
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

  before('place', () =>
    PlaceRepository
      .create(validPlace)
      .tap(place => {
        placeUrl = `/places/${place.get('id')}`;
        userPlaceRole.tippiqId = validPolicy.userId;
        userPlaceRole.placeId = place.get('id');
      })
      .tap(() => after('place', () =>
        request(app)
          .del(placeUrl)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)))
  );

  before('create user-place-role', () => UserPlaceRoleRepository.create(userPlaceRole));

  before(done => {
    request(app)
      .post(`${placeUrl}/policies?clientId=${clientId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send(validPolicy)
      .end((err, res) => {
        policyUrl = res.headers.location;

        if (err) {
          return done(err);
        }
        return done();
      });
  });

  it('should remove a policy when valid url is provided', () =>
    request(app)
      .del(policyUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
  );

  it('should work only once', () =>
    request(app)
      .del(policyUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404)
  );

  it('should require an existing policy', () =>
    request(app)
      .del(`${placeUrl}/policies/00000000-0000-0000-0000-000000000000`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404)
  );

  it('should require a valid uuid', () =>
    request(app)
      .del(`${placeUrl}/policies/non-existing-id`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400)
  );
});

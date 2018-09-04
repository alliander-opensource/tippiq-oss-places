import { app, expect, request, getSignedJwt } from '../../../common/test-utils';
import validUserPlaceRole from '../../../testdata/valid-user-place-role';
import validPlace from '../../../testdata/valid-place';
import { PlaceRepository } from '../../places/repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import config from '../../../config';
import ServerMock from '../../../common/server-mock';

describe('Get user place roles records', () => {
  config.tippiqIdBaseUrl = 'http://localhost:13001';

  const tippiqIdMockServer = new ServerMock({ port: 13001 });
  before('mock server', () => tippiqIdMockServer.start());
  after('mock server', () => tippiqIdMockServer.stop());

  let placeUrl;
  let placeId;
  let userPlaceRole1;
  let userPlaceRole2;
  let authToken;

  before('place', () =>
    PlaceRepository
      .create(validPlace)
      .tap(place => {
        placeUrl = `/places/${place.get('id')}`;
        placeId = place.get('id');
        userPlaceRole1 = validUserPlaceRole();
        userPlaceRole2 = validUserPlaceRole();
        userPlaceRole1.placeId = placeId;
        userPlaceRole2.placeId = placeId;
      })
      .tap(() => after('place', () => PlaceRepository.deleteById(placeId)))
  );

  before('user place role 1', () => UserPlaceRoleRepository.create(userPlaceRole1)
  );

  before(() =>
    getSignedJwt({ sub: userPlaceRole1.tippiqId }).then(token => { authToken = token; })
  );

  before('user place role 2', () => UserPlaceRoleRepository.create(userPlaceRole2)
  );

  it('should 403 when not authorized', () =>
    request(app)
      .get(`${placeUrl}/user-place-roles`)
      .set('Accept', 'application/json')
      .expect(403)
  );

  it('should return all user place roles for the place', () =>
    request(app)
      .get(`${placeUrl}/user-place-roles`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect(res => expect(res.body).to.have.length(2))
      .expect(res => expect(res.body[0]).to.have.property('role'))
      .expect(res => expect(res.body[1]).to.have.property('role'))
  );
});

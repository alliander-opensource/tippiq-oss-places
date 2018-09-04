import { app, expect, request, getSignedJwt } from '../../../common/test-utils';
import { PlaceRepository } from '../repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import validUserPlaceRole from '../../../testdata/valid-user-place-role';
import validPlace from '../../../testdata/valid-place';

describe('Get place', () => {
  const userPlaceRole = validUserPlaceRole();
  let placeUrl;
  let authToken;

  before('place', () => (
    PlaceRepository
      .create(validPlace)
      .tap(place => {
        placeUrl = `/places/${place.get('id')}`;
        userPlaceRole.placeId = place.get('id');
      }))
      .tap(() => after('place', () => (
        request(app)
          .del(placeUrl)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200))
      ))
  );

  before('create user-place-role', () => UserPlaceRoleRepository.create(userPlaceRole));

  before(() =>
    getSignedJwt({ sub: userPlaceRole.tippiqId }).then(token => { authToken = token; })
  );

  it('should return 200 if the place exists', () =>
    request(app)
      .get(placeUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect(res => expect(res.body).to.have.property('id'))
  );

  it('should return 403 if the place does not exist', () =>
    request(app)
      .get('/places/00000000-0000-0000-0000-000000000000')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(403)
  );
});

import { app, request, getSignedJwt } from '../../../common/test-utils';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import validUserPlaceRole from '../../../testdata/valid-user-place-role';
import validPlace from '../../../testdata/valid-place';
import { PlaceRepository } from '../repositories';

describe('Delete place', () => {
  const userPlaceRole = validUserPlaceRole();
  let placeUrl;
  let authToken;

  before('place', () =>
    PlaceRepository
      .create(validPlace)
      .then(place => {
        placeUrl = `/places/${place.get('id')}`;
        userPlaceRole.placeId = place.get('id');
        return UserPlaceRoleRepository
          .create(userPlaceRole);
      })
  );

  before('create user-place-role', () => UserPlaceRoleRepository.create(userPlaceRole));

  before(() =>
    getSignedJwt({ sub: userPlaceRole.tippiqId }).then(token => { authToken = token; })
  );

  it('should require authentication', () =>
    request(app)
      .del(placeUrl)
      .expect(403)
  );

  it('should remove a place with all users when valid url is provided', () =>
    request(app)
      .del(placeUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
  );

  it('should work only once', () =>
    request(app)
      .del(placeUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(403)
  );

  it('should require an existing place', () =>
    request(app)
      .del('/places/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(403)
  );

  it('should require a valid uuid', () =>
    request(app)
      .del('/places/non-existing-id')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(500)
  );
});

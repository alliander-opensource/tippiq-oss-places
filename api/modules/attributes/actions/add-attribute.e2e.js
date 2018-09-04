import { request, app, getSignedJwt } from '../../../common/test-utils';
import { PlaceRepository } from '../../places/repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import validUserPlaceRole from '../../../testdata/valid-user-place-role';
import validPlace from '../../../testdata/valid-place';
import validAttribute from '../../../testdata/valid-attribute';

describe('Adding a place attribute', () => {
  const userPlaceRole = validUserPlaceRole('place_admin');
  let placeId;
  let authToken;

  before('create place', () =>
    PlaceRepository
      .create(validPlace)
      .tap(place => {
        placeId = place.get('id');
        userPlaceRole.placeId = placeId;
        after('remove place', () =>
          request(app)
            .del(`/places/${placeId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200));
      })
  );

  before('create user-place-role', () => UserPlaceRoleRepository.create(userPlaceRole));

  before(() =>
    getSignedJwt({ sub: userPlaceRole.tippiqId }).then(token => {
      authToken = token;
    })
  );

  it('should add an attribute when valid data is provided', () =>
    request(app)
      .post(`/places/${placeId}/attributes`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send(validAttribute)
      .expect(201)
  );

  it('should not add an attribute when invalid data is provided', () =>
    request(app)
      .post(`/places/${placeId}/attributes`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send('invaliddata')
      .expect(400)
  );
});

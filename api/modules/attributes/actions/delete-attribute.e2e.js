import { app, request, getSignedJwt } from '../../../common/test-utils';
import { PlaceRepository } from '../../places/repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import { AttributeRepository } from '../../attributes/repositories';
import validUserPlaceRole from '../../../testdata/valid-user-place-role';
import validPlace from '../../../testdata/valid-place';
import validAttribute from '../../../testdata/valid-attribute';

describe('Delete attribute', () => {
  const userPlaceRole = validUserPlaceRole('place_admin');
  let attributeUrl;
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

  before('create attribute', () =>
    AttributeRepository
      .create({ ...validAttribute, type: validAttribute.data.type, place_id: placeId })
      .tap(attribute => (attributeUrl = `/places/${placeId}/attributes/${attribute.get('id')}`))
  );

  before(() =>
    getSignedJwt({ sub: userPlaceRole.tippiqId }).then(token => { authToken = token; })
  );

  it('should send 403 when not authorized', () =>
    request(app)
      .del(attributeUrl)
      .expect(403)
  );

  it('should remove an attribute when valid url is provided', () =>
    request(app)
      .del(attributeUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
  );

  it('should work only once', () =>
    request(app)
      .del(attributeUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404)
  );

  it('should require an existing attribute', () =>
    request(app)
      .del('/attributes/non-existing-id')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404)
  );
});


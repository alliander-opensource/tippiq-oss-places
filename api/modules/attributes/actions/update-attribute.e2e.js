import { request, app, getSignedJwt, expect } from '../../../common/test-utils';
import { PlaceRepository } from '../../places/repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import { AttributeRepository } from '../../attributes/repositories';
import validUserPlaceRole from '../../../testdata/valid-user-place-role';
import validPlace from '../../../testdata/valid-place';
import validAttribute from '../../../testdata/valid-attribute';

describe('Updating a place attribute', () => {
  const userPlaceRole = validUserPlaceRole('place_admin');
  let placeId;
  let attributeUrl;
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

  it('should send 403 when not authorized ', () =>
    request(app)
      .get(attributeUrl)
      .set('Accept', 'application/json')
      .expect(403)
  );

  it('should update unaltered attribute', () =>
    request(app)
      .put(attributeUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send(validAttribute)
      .expect(200)
      .expect(res => expect(res.body).to.have.property('placeId', placeId))
  );

  it('should update data', () => {
    const validAttr = Object.assign({}, validAttribute);
    validAttr.data.GeoJSON = 'here';
    return request(app)
      .put(attributeUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send(validAttr)
      .expect(200)
      .expect(res =>
        expect(res.body).to.have.deep.property('data.GeoJSON', validAttr.data.GeoJSON));
  });

  it('should not update when invalid data is provided', () =>
    request(app)
      .put(attributeUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send('invaliddata')
      .expect(400)
  );
});

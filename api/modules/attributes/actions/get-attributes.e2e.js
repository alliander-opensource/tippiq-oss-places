import { app, request, getSignedJwt, expect } from '../../../common/test-utils';
import { PlaceRepository } from '../../places/repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import { AttributeRepository } from '../../attributes/repositories';
import validUserPlaceRole from '../../../testdata/valid-user-place-role';
import validPlace from '../../../testdata/valid-place';
import validAttribute from '../../../testdata/valid-attribute';

describe('Get attributes', () => {
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

  before('create attribute', () =>
    AttributeRepository
      .create({ ...validAttribute, type: validAttribute.data.type, place_id: placeId })
  );

  before('create 2nd attribute', () => {
    const validAttr = Object.assign({}, validAttribute);
    validAttr.data.type = 'other type';
    return AttributeRepository
      .create({ ...validAttr, type: validAttr.data.type, place_id: placeId });
  });

  before(() =>
    getSignedJwt({ sub: userPlaceRole.tippiqId, placeId }).then(token => { authToken = token; })
  );

  it('should return 2 attributes', () =>
    request(app)
      .get(`/places/${placeId}/attributes`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect(res => expect(res.body.length).to.equal(2))
  );

  it('should return only 1 attribute when filtered for type', () =>
    request(app)
      .get(`/places/${placeId}/attributes?type=${validAttribute.data.type}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect(res => expect(res.body.length).to.equal(1))
  );
});

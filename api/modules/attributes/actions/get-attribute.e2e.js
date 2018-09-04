import { app, request, getSignedJwt, expect } from '../../../common/test-utils';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import { AttributeRepository } from '../../attributes/repositories';
import validUserPlaceRole from '../../../testdata/valid-user-place-role';
import locationAccessToken from '../../../testdata/location-access-token';
import locationPlace from '../../../testdata/location-place';
import locationPolicy from '../../../testdata/location-policy';
import locationAttribute from '../../../testdata/location-attribute';

describe('Get attribute', () => {
  const userPlaceRole = validUserPlaceRole('place_admin', locationPolicy.userId);
  userPlaceRole.placeId = locationPlace.id;
  userPlaceRole.id = locationAccessToken.userId;
  let attributeUrl;
  let authToken;

  before('create user-place-role', () => UserPlaceRoleRepository.create(userPlaceRole));

  before('create attribute', () =>
    AttributeRepository
      .create(locationAttribute)
      .tap(attribute => (attributeUrl = `/places/${locationAttribute.placeId}/attributes/${attribute.get('id')}`))
  );

  before(() =>
    getSignedJwt({ sub: userPlaceRole.tippiqId }).then(token => { authToken = token; })
  );

  after('remove attribute', () =>
    request(app)
      .del(attributeUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
  );

  describe('with user credentials', () => {
    it('should send 403 when not authorized ', () =>
      request(app)
        .get(attributeUrl)
        .set('Accept', 'application/json')
        .expect(403)
    );

    it('should return 200 if the attribute exists', () =>
      request(app)
        .get(attributeUrl)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
    );
  });

  describe('with access token', () => {
    it('should return 200 if the attribute exists', () =>
      request(app)
        .get(`${attributeUrl}?type=${locationAttribute.data.type}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${locationAccessToken.token}`)
        .expect(200)
        .expect(res => expect(res.body).to.have.property('id'))
    );

    it('should return 404 if the attribute does not exist', () =>
      request(app)
        .get(`/api/attributes/00000000-0000-0000-0000-000000000000?type=${locationAttribute.data.type}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${locationAccessToken.token}`)
        .expect(404)
    );

    it('should not return top level type column', () =>
      request(app)
        .get(`${attributeUrl}?type=${locationAttribute.data.type}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${locationAccessToken.token}`)
        .expect(200)
        .expect(res => expect(res.body).to.not.have.property('type'))
    );
  });
});

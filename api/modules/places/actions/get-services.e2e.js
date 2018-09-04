import { app, expect, request, getSignedJwt } from '../../../common/test-utils';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import validUserPlaceRole from '../../../testdata/valid-user-place-role';


describe('Get place services', () => {
  const userPlaceRole = validUserPlaceRole();
  userPlaceRole.placeId = '47039b65-b1d4-9b65-33d5-b647033d545a';
  let authToken;

  before('create user-place-role', () => UserPlaceRoleRepository.create(userPlaceRole));

  before(() =>
    getSignedJwt({ sub: userPlaceRole.tippiqId }).then(token => { authToken = token; })
  );

  it('should return 403 is not authenticated', () =>
    request(app)
      .get('/places/47039b65-b1d4-9b65-33d5-b647033d545a/services')
      .set('Accept', 'application/json')
      .expect(403)
  );

  it('should return 200 if the place service exist', () =>
    request(app)
      .get('/places/47039b65-b1d4-9b65-33d5-b647033d545a/services')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect(res => expect(res.body.length).to.equal(1))
      .expect(res => expect(res.body[0]).to.have.property('id'))
      .expect(res => expect(res.body[0]).to.have.property('name'))
      .expect(res => expect(res.body[0]).to.have.property('logo'))
      .expect(res => expect(res.body[0]).to.have.property('brandColor'))
  );

  it('should return no services if the place does not exist', () =>
    request(app)
      .get('/places/00000000-0000-0000-0000-000000000000/services')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(403)
  );
});

import { filter, clone } from 'lodash';
import { app, expect, request, getSignedJwt } from '../../../common/test-utils';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import validUserPlaceRole from '../../../testdata/valid-user-place-role';
import { PlaceRepository } from '../repositories';
import { PolicyRepository } from '../../policies/repositories';
import validPlace from '../../../testdata/valid-place';
import locationPolicy from '../../../testdata/location-policy';

describe('Get service providers except active', () => {
  const userPlaceRole = validUserPlaceRole();
  let authToken;
  let placeUrl;
  let placeId;
  let policyId;

  before('place', () =>
    PlaceRepository
      .create(validPlace)
      .tap(place => {
        placeId = place.get('id');
        placeUrl = `/places/${placeId}`;
        userPlaceRole.placeId = placeId;
      })
      .tap(() => after('place', () =>
        request(app)
          .del(placeUrl)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)))
  );

  before('policy', () => {
    const newPolicy = clone(locationPolicy);
    newPolicy.placeId = placeId;
    delete newPolicy.id;
    return PolicyRepository
      .create(newPolicy, { insert: true })
      .then(policy => {
        policyId = policy.get('id');
      });
  });

  before('create user-place-role', () => UserPlaceRoleRepository.create(userPlaceRole));

  before(() =>
    getSignedJwt({ sub: userPlaceRole.tippiqId }).then(token => { authToken = token; })
  );

  after('policy', () => PolicyRepository.deleteById(policyId));

  it('should get all services providers except Fake 3P because it is used in a policy', () =>
    request(app)
      .get(`/places/${placeId}/services-except-active`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of.at.least(1))
      .expect(res => expect(filter(res.body,
        (s) => s.serviceProviderId === locationPolicy.serviceProviderId).length).to.equal(0))
  );
});

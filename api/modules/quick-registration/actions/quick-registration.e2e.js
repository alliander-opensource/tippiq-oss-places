import { request, app, expect, getSignedJwt } from '../../../common/test-utils';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import { PolicyRepository } from '../../policies/repositories';
import { ACTIONS } from '../../auth/auth';
import quickLocationPolicy from '../../../testdata/quick-location-policy';
import quickNewsletterPolicy from '../../../testdata/quick-newsletter-policy';
import quickLocationAttribute from '../../../testdata/quick-location-attribute';

describe('Quick registration process', () => {
  const userId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const placeAddress = {
    type: quickLocationPolicy.templateSlug,
    ...quickLocationAttribute.data,
  };
  const policies = [
    quickLocationPolicy,
    quickNewsletterPolicy,
  ];

  let serviceToken;
  let invalidServiceToken;

  before(() => getSignedJwt({ action: ACTIONS.QUICK_REGISTRATION }).then(token => {
    serviceToken = token;
  }));

  before(() => getSignedJwt(
    { action: ACTIONS.QUICK_REGISTRATION },
    { issuer: 'invalid-service' } // only tippiq id can be a valid issuer for this endpoint
  ).then(token => { invalidServiceToken = token; }));

  after(() => UserPlaceRoleRepository.deleteWhere({ tippiq_id: userId }));

  it('should return placeToken and accessToken', () =>
    request(app)
      .post('/quick-registration')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${serviceToken}`)
      .send({
        userId,
        placeAddress,
        policies,
      })
      .expect(201)
      .expect(res => expect(res.body).to.have.property('placeToken'))
      .expect(res => expect(res.body.placeToken).to.have.length.above(1))
      .expect(res => expect(res.body).to.have.property('accessToken'))
      .expect(res => expect(res.body.accessToken).to.have.length.above(1))
  );

  it('should have 2 policies', () =>
    PolicyRepository.findAll({ user_id: userId })
      .then(results => expect(results.length).to.equal(2))
  );

  it('should fail when calling service is not tippiq-id', () =>
    request(app)
      .post('/quick-registration')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${invalidServiceToken}`)
      .send({
        userId,
        placeAddress,
        policies,
      })
      .expect(403)
  );
});

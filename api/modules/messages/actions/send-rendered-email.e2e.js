import { request, app, getSignedTippiqHoodJwt } from '../../../common/test-utils';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import { PolicyRepository } from '../../policies/repositories';
import { PlaceRepository } from '../../places/repositories';
import { ACTIONS } from '../../auth/auth';
import validPlace from '../../../testdata/valid-place';
import validUserPlaceRole from '../../../testdata/valid-user-place-role';
import fake3pServiceProvider from '../../../testdata/fake3p-service-provider';
import quickNewsletterPolicy from '../../../testdata/quick-newsletter-policy';
import ServerMock from '../../../common/server-mock';

describe('Send rendered email', () => {
  const tippiqIdMockServer = new ServerMock({ port: 13001 });
  const userPlaceRole = validUserPlaceRole();
  const messageBody = {
    userId: userPlaceRole.tippiqId,
    serviceProviderId: fake3pServiceProvider.id,
    html: '<html><h1>Rendered email</h1></html>',
    text: 'rendered email text',
    subject: 'test e-mail',
  };
  let placeId;
  let serviceToken;

  before('mock server', () => tippiqIdMockServer.start());
  after('mock server', () => tippiqIdMockServer.stop());

  before('3P service token', () => getSignedTippiqHoodJwt({ action: ACTIONS.SEND_MESSAGE }).then(token => {
    serviceToken = token;
  }));

  before('create place', () =>
    PlaceRepository
      .create(validPlace)
      .tap(place => {
        placeId = place.get('id');
        userPlaceRole.placeId = placeId;
      })
  );

  before('create user-place-role', () => UserPlaceRoleRepository.create(userPlaceRole));

  after('cleanup', () =>
    UserPlaceRoleRepository
      .findOne({ tippiq_id: userPlaceRole.tippiqId })
      .tap(() => PolicyRepository.deleteWhere({ user_id: userPlaceRole.tippiqId }))
      .then(() => PlaceRepository.deleteById(userPlaceRole.placeId))
  );

  it('should return 403 when service token is not supplied', () =>
    request(app)
      .post(`/places/${placeId}/users/${userPlaceRole.tippiqId}/messages/rendered-email`)
      .set('Accept', 'application/json')
      .send(messageBody)
      .expect(403)
  );

  describe('when policy is not available', () => {
    it('should return 204 when message is sent', () =>
      request(app)
        .post(`/places/${placeId}/users/${userPlaceRole.tippiqId}/messages/rendered-email`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${serviceToken}`)
        .send(messageBody)
        .expect(204)
    );
  });

  describe('when policy is set', () => {
    before('Set policy', () =>
      PolicyRepository.create(Object.assign({},
        quickNewsletterPolicy, // TODO Use more generic send message policy one day
        {
          userId: userPlaceRole.tippiqId,
          placeId: userPlaceRole.placeId,
        }
      ))
    );

    it('should return 204 when policy is set and message is sent', () =>
      request(app)
        .post(`/places/${placeId}/users/${userPlaceRole.tippiqId}/messages/rendered-email`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${serviceToken}`)
        .send(messageBody)
        .expect(204)
    );
  });
});

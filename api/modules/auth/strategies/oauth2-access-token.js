/**
 * Oauth2 Token Strategy.
 * @module modules/auth/strategies/oauth2
 */
import { Strategy } from 'passport-http-bearer';

import { OAuth2AccessTokenRepository } from '../../oauth2/repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';

export default new Strategy((token, done) => {
  OAuth2AccessTokenRepository
    .findOne({ token })
    .then(accessToken => Promise.all([
      accessToken.get('clientId'),
      UserPlaceRoleRepository.findById(accessToken.get('userId')),
    ]))
    .then(([clientId, userPlaceRole]) => ({
      userId: userPlaceRole.get('tippiqId'),
      placeId: userPlaceRole.get('placeId'),
      clientId,
      strategy: 'OAuth2AccessToken',
    }))
    .asCallback(done);
});

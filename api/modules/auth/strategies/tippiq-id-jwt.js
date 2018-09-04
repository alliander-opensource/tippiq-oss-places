/**
 * JWT Token Passport Strategy.
 * @module modules/auth/strategies/jwt
 */

import BPromise from 'bluebird';
import { ExtractJwt, Strategy } from 'passport-jwt';
import AuthenticationError from '../../../common/errors';

import config from '../../../config';

const options = Object.freeze({
  issuer: config.tippiqIdJwtIssuer,
  audience: config.jwtAudience,
  secretOrKey: config.tippiqIdPublicKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
});

export default new Strategy(options, (jwtPayload, done) => {
  BPromise.resolve()
    .then(() => {
      if (jwtPayload.action && !jwtPayload.sub) {
        return {
          service: 'tippiq-id-service',
          action: jwtPayload.action,
        };
      }
      return (jwtPayload.sub ? { userId: jwtPayload.sub, strategy: 'TippiqIDJWT', placeId: jwtPayload.placeId } :
        new AuthenticationError('Incorrect or empty token user'));
    })
    .asCallback(done);
});

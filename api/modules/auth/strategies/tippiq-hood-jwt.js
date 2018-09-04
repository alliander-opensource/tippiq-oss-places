/**
 * JWT Token Passport Strategy for Tippiq Hood.
 * @module modules/auth/strategies/tippiq-hood-jwt
 */

import BPromise from 'bluebird';
import { ExtractJwt, Strategy } from 'passport-jwt';
import AuthenticationError from '../../../common/errors';

import config from '../../../config';

const options = Object.freeze({
  issuer: config.tippiqHoodJwtIssuer,
  audience: config.jwtAudience,
  secretOrKey: config.tippiqHoodPublicKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
});

export default new Strategy(options, (jwtPayload, done) => {
  BPromise.resolve()
    .then(() => {
      if (jwtPayload.action && !jwtPayload.sub) {
        return {
          service: 'tippiq-hood-service',
          action: jwtPayload.action,
        };
      }
      return (jwtPayload.sub ? { userId: jwtPayload.sub, strategy: 'TippiqHoodJWT', placeId: jwtPayload.placeId } :
        new AuthenticationError('Incorrect or empty token user'));
    })
    .asCallback(done);
});

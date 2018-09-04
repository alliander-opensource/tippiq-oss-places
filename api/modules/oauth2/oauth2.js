/**
 * OAuth2 / oauth2orize server actions
 * @module modules/oauth2/oauth2
 */
import oauth2orize from 'oauth2orize';
import srs from 'secure-random-string';

import { sendError } from '../../common/route-utils';

import {
  OAuth2ClientRepository,
  OAuth2AuthorizationCodeRepository,
  OAuth2AccessTokenRepository,
} from './repositories';
import {
  oauth2CodeLength,
  oauth2TokenLength,
} from '../../config';
import { UserPlaceRoleRepository } from '../user-place-roles/repositories';

import json from './response/json';

const server = oauth2orize.createServer();

server.serializeClient((client, done) => done(null, client.clientId));

server.deserializeClient((clientId, done) =>
  OAuth2ClientRepository
    .findOne({ client_id: clientId })
    .then(client =>
      done(null, client.serialize({ context: 'oauth2-client' }))
    )
);

server.grant(
  oauth2orize.grant.code({
    modes: { query: json }, // Override redirect response with json result
  }, (client, redirectURI, user, ares, done) => { // eslint-disable-line max-params
    const code = {
      code: srs({ length: oauth2CodeLength }),
      client_id: client.clientId,
      user_id: user,
    };
    OAuth2AuthorizationCodeRepository
      .create(code)
      .then(authorizationCode => done(null, authorizationCode.get('code')));
  })
);

/**
 * Creates an oauth2 access token
 * @function createAccessToken
 * @param {string} clientId Client to create token for
 * @param {string} userId User to create token for
 * @returns {Object} OAuth2 access token
 */
export function createAccessToken(clientId, userId) {
  const accessToken = {
    token: srs({ length: oauth2TokenLength }),
    client_id: clientId,
    user_id: userId,
  };
  return OAuth2AccessTokenRepository.create(accessToken, null)
    .then(token => token.get('token'));
}

// Exchange authorization codes for access tokens.  The callback accepts the
// `client`, which is exchanging `code` and any `redirectURI` from the
// authorization request for verification.  If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code.
server.exchange(oauth2orize.exchange.code((client, code, redirectUri, done) => {
  if (typeof client === 'undefined') {
    done(new Error('Invalid Request')); // TODO add correct error and replace error handler
    return;
  }

  OAuth2AuthorizationCodeRepository
    .findOne({
      code,
      client_id: client.client_id,
    })
    .then((model) => {
      const authCode = model.serialize({ context: 'oauth2-code' });

      if (authCode.redirectUri !== null && authCode.redirectUri !== redirectUri) {
        return done(null, false);
      }
      // Check if auth is not older than 1 hour
      if (new Date().getTime() - (60 * 60 * 1000) > authCode.createdAt.getTime()) {
        return OAuth2AuthorizationCodeRepository
          .deleteWhere({
            code,
            client_id: client.client_id,
          })
          .then(() => done(null, false));
      }
      return createAccessToken(authCode.clientId, authCode.userId)
        .tap(OAuth2AuthorizationCodeRepository.deleteWhere({
          code,
          client_id: client.client_id,
        }))
        .then(token => done(null, token))
        .catch(err => done(err));
    })
    .catch(OAuth2AuthorizationCodeRepository.Model.NotFoundError, () => {
      done(new Error('Invalid Request')); // TODO add correct error and replace error handler
    })
    .catch(err => done(err));
}));

/**
 * Extracts user id from req.user and assigns it to req.user (oauth2orize requires this).
 * @function processUser
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express callback.
 * @returns {undefined}
 */
function processUser(req, res, next) {
  if (typeof req.user === 'undefined' ||
      typeof req.user.userId === 'undefined' ||
      typeof req.user.placeId === 'undefined') {
    return sendError(res, 403, 'Geen toegang: je hebt niet de juiste toestemming.');
  }
  return UserPlaceRoleRepository
    .getUserPlaceRoleByTippiqUserIdAndPlace(req.user.userId, req.user.placeId)
    .tap(userPlaceRole => {
      req.user = userPlaceRole.get('id'); // eslint-disable-line no-param-reassign
      return next();
    });
}

export const authorization = [
  server.authorization((clientId, redirectUri, done) =>
    OAuth2ClientRepository
      .findOne({ client_id: clientId })
      .then(client => done(null, client.serialize({ context: 'oauth2-client' }), redirectUri))
      .catch(OAuth2ClientRepository.Model.NotFoundError, () => done('ClientId could not be found.'))
      .catch(() => done('Internal server error.')) // TODO replace with better error handling
  ),
  (req, res) => {
    res.json({ client: req.oauth2.client, transactionId: req.oauth2.transactionID });
  },
];

export const decision = [
  processUser,
  server.decision(),
];

export const token = [
  server.token(),
  server.errorHandler(), //TODO: replace this with our custom errorHandler
];

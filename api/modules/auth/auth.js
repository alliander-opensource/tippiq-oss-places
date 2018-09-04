/**
 * Helper functions that codify our use of bcrypt to authenticate users.
 * @module modules/auth/auth
 */

import bcrypt from 'bcrypt-nodejs';
import debugLogger from 'debugnyan';
import passport from 'passport';
import BPromise from 'bluebird';
import { intersection, defaults, flattenDeep, get } from 'lodash';
import jwt from 'jsonwebtoken';

import { AuthenticationError } from '../../common/errors';
import { sendUnauthorized } from '../../common/route-utils';
import RolePermissionRepository from './role-permission-repository';
import UserRoleRepository from './user-role-repository';
import config from '../../config';

BPromise.promisifyAll(bcrypt);

const debug = debugLogger('tippiq-places:auth');
const rolePermissionRepository = new RolePermissionRepository();
const userRoleRepository = new UserRoleRepository();

export const ROLES = Object.freeze({
  ANONYMOUS: 'anonymous',
  AUTHENTICATED: 'authenticated',
  OWNER: 'owner',
});

export const ACTIONS = Object.freeze({
  QUICK_REGISTRATION: 'tippiq_places.quick-registration',
  SEND_MESSAGE: 'tippiq_places.send-message',
});

/**
 * Use bcrypt to salt and hash the clear text password.
 * @function hashPassword
 * @param {string} password Clear text password to be hashed.
 * @returns {string} a salted hash from the password.
 */
export function hashPassword(password) {
  return bcrypt
    .genSaltAsync(5)
    .then(salt => bcrypt.hashAsync(password, salt, null));
}

/**
 * Use bcrypt to compare the given clear text password against the hash.
 * @function verifyPassword
 * @param {string} password Clear text.
 * @param {string} hash Salted hash from storage.
 * @returns {boolean} True when the clear text matches the hash.
 */
export function verifyPassword(password, hash) {
  return bcrypt
    .compareAsync(password, hash)
    .catch(Error, (err) => {
      debug.debug(`Invalid credentials: ${err.message}`);
      throw new AuthenticationError('Invalid credentials.');
    });
}

/**
 * Parse a jwt token from the Authentication header and add a user object to the request when it
 * results in a valid user.
 * @function tippiqIDJwtAuthentication
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express callback.
 * @returns {undefined}
 */
export function tippiqIDJwtAuthentication(req, res, next) {
  passport.authenticate('tippiqIDJwt', { session: false }, (err, user) => {
    if (!user) {
      next();
    } else {
      req.logIn(user, { session: false }, next);
    }
  })(req, res, next);
}

/**
 * Parse a jwt token from the Authentication header and add a user object to the request when it
 * results in a valid user.
 * @function tippiqHoodJwtAuthentication
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express callback.
 * @returns {undefined}
 */
export function tippiqHoodJwtAuthentication(req, res, next) {
  passport.authenticate('tippiqHoodJwt', { session: false }, (err, user) => {
    if (!user) {
      next();
    } else {
      req.logIn(user, { session: false }, next);
    }
  })(req, res, next);
}

/**
 * Parse the Authentication header and add a user object to the request when it results in a
 * valid user.
 * @function oauth2AccessTokenAuthentication
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express callback.
 * @returns {undefined}
 */
export function oauth2AccessTokenAuthentication(req, res, next) {
  passport.authenticate('oauth2AccessToken', { session: false }, (err, user) => {
    if (!user) {
      next();
    } else {
      req.logIn(user, { session: false }, next);
    }
  })(req, res, next);
}

/**
 * Parse the Basic Authentication header and add a user object to the request when it results
 * in a valid client.
 * @function oauth2ClientAuthentication
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express callback.
 * @returns {undefined}
 */
export function oauth2ClientAuthentication(req, res, next) {
  passport.authenticate('oauth2Client', { session: false }, (err, user) => {
    if (!user) {
      next();
    } else {
      req.logIn(user, { session: false }, next);
    }
  })(req, res, next);
}

const userRoles = userId => {
  if (!userId) {
    return [];
  }
  return [
    ROLES.AUTHENTICATED,
    ...userRoleRepository
      .findRolesByUser(userId)
      .then(roles => roles.map(role => role.get('role'))),
  ];
};
/**
 * Validate the permissions.
 * @function validatePermissions
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {string} permission Permissions to check for
 * @param {Array} localRoles Array of local roles
 * @returns {Promise} Resolves only if permissions validate
 */
export function validatePermissions(req, res, permission, localRoles = []) {
  debug.info({ permission, user: req.user });
  return new Promise((resolve) => {
    const userId = get(req, 'user.userId');
    BPromise
      .all([
        BPromise
          .all([
            ROLES.ANONYMOUS,
            localRoles,
            userRoles(userId),
          ])
          .then(flattenDeep),
        rolePermissionRepository
          .findRolesByPermission(permission)
          .then(rolePermissions => rolePermissions.map(rolePermission => rolePermission.get('role'))),
      ])
      .spread((myRoles, rolePermissions) => {
        if (intersection(myRoles, rolePermissions).length === 0) {
          sendUnauthorized(res, userId || 'anonymous', permission);
        } else {
          resolve();
        }
      });
  });
}

/**
 * Validate the service permissions.
 * @function validatePermissions
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {string} action Action to check permissions for
 * @returns {Promise} Resolves only if permissions validate
 */
export function validateServicePermissions(req, res, action) {
  return new BPromise((resolve) => {
    if (req.user && req.user.action === action) {
      resolve();
    } else {
      sendUnauthorized(res, 'service', action);
    }
  });
}

/**
 * Generate a signed JWT for a place.
 * @function getSignedPlaceJwt
 * @param {Object} [payload] To include in the token.
 * @param {string} [placePrivateKey] Key to create the token with.
 * @returns {Promise<string>} JWT
 */
export function getSignedPlaceJwt(payload, placePrivateKey) {
  const JWT_OPTIONS = {
    algorithm: 'RS256',
    audience: config.tippiqIdAudience,
    expiresIn: '100y',
    issuer: config.jwtIssuer,
  };
  const jwtPayload = defaults({}, payload);
  const jwtOptions = defaults({}, JWT_OPTIONS);
  return BPromise.try(() => jwt.sign(jwtPayload, placePrivateKey, jwtOptions));
}

/**
 * Generate a Places service signed JWT with audience Tippiq-ID.
 * @function getSignedPlacesServiceJwt
 * @param {Object} [payload] To include in the token.
 * @returns {Promise<string>} JWT
 */
export function getSignedPlacesServiceJwt(payload) {
  const JWT_OPTIONS = {
    algorithm: 'RS256',
    audience: config.tippiqIdAudience,
    expiresIn: '5m',
    issuer: config.jwtIssuer,
  };
  const jwtPayload = defaults({}, payload);
  const jwtOptions = defaults({}, JWT_OPTIONS);
  return BPromise.try(() => jwt.sign(jwtPayload, config.tippiqPlacesPrivateKey, jwtOptions));
}

export default {
  tippiqIDJwtAuthentication,
  tippiqHoodJwtAuthentication,
  oauth2AccessTokenAuthentication,
  oauth2ClientAuthentication,
};

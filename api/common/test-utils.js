/**
 * Utility functions for testing.
 * @module common/test-utils
 */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiThings from 'chai-things';
import jwt from 'jsonwebtoken';

import { defaults } from 'lodash';
import BPromise from 'bluebird';

import config from '../config';

export interceptAdresses from './tippiq-addresses-api-mock';
export chai, { expect } from 'chai';
export request from 'supertest-as-promised';
export app from '../api';

chai.use(chaiAsPromised);
chai.use(chaiThings);

/* this private key should be used for testing/local dev only */
const tippiqIdPrivateKey = `-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIJr08Kf8I7x/CPF87tLAbs3LpyYXk5IU0Np18+8nxK8FoAcGBSuBBAAK
oUQDQgAEIwr0ttbt6S6lj3e8nuP3KN/clEw1RICwk5d2Yy4hgKn7e6kBjeORFNnQ
DNj5GIGNmK0zb3SzW17JNzf22ooavQ==
-----END EC PRIVATE KEY-----`;

/* this private key should be used for testing/local dev only */
const tippiqHoodPrivateKey = `-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIJgM/TXgJh8ADEsH+NuDG4W4acIwcHmhpsJiNjsMsvQEoAcGBSuBBAAK
oUQDQgAEvmC2rDsrwYWTRM++en5v8G+vZ29iWwH1ZqzeFFvNJQKzY+vCdGI4RJgI
YxmIqeCRCj1VI7gU8jGXOMNaAnfw0Q==
-----END EC PRIVATE KEY-----`;

const JWT_EXPIRATION = '7d';
const JWT_OPTIONS = {
  algorithm: 'RS256',
  audience: config.jwtAudience,
  expiresIn: JWT_EXPIRATION,
  issuer: config.tippiqIdJwtIssuer,
};

/**
 * Generate a signed JWT with defaults for the audience and issuer.
 * @function getSignedJwt
 * @param {Object} [payload] To include in the token.
 * @param {Object} [options] To create the token with.
 * @returns {Promise<string>} JWT
 */
export function getSignedJwt(payload, options) {
  const jwtPayload = Object.assign({}, payload);
  const jwtOptions = Object.assign({}, JWT_OPTIONS, options);
  return BPromise.try(() => jwt.sign(jwtPayload, tippiqIdPrivateKey, jwtOptions));
}

/**
 * Generate a signed JWT with Tippiq-Hood with defaults for the audience and issuer.
 * @function getSignedTippiqHoodJwt
 * @param {Object} [payload] To include in the token.
 * @param {Object} [options] To create the token with.
 * @returns {Promise<string>} JWT
 */
export function getSignedTippiqHoodJwt(payload, options) {
  const jwtPayload = defaults({}, payload);
  const jwtOptions = defaults({}, options, JWT_OPTIONS);
  jwtOptions.issuer = config.tippiqHoodJwtIssuer;
  return BPromise.try(() => jwt.sign(jwtPayload, tippiqHoodPrivateKey, jwtOptions));
}

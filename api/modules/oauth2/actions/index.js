/**
 * Point of contact for oauth2 actions.
 * @module modules/oauth2
 * @example import { getProfile } from './actions';
 */

import getProfile from './get-profile';
import verifyRedirectUri from './verify-redirect-uri';

export {
  getProfile,
  verifyRedirectUri,
};

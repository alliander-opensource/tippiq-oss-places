/**
 * Point of contact for oauth2 module.
 * @module modules/oauth2
 * @example import { routes } from './oauth2';
 */

import { createAccessToken } from './oauth2';
import routes from './oauth2-routes';

export default {
  createAccessToken,
  routes,
};

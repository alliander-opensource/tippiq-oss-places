/**
 * Point of contact for user place roles module.
 * @module modules/user-place-roles
 * @example import { UserPlaceRole, } from './userPlaceRoles';
 */

import routes from './user-place-role-routes';

export { UserPlaceRole } from './models';
export { UserPlaceRoleRepository } from './repositories';

export default {
  routes,
};

/**
 * @author Tippiq
 */
import BPromise from 'bluebird';
import { get } from 'lodash';

import { UserPlaceRoleRepository } from './repositories';
import { UserPlaceRole } from './models';
import { ROLES } from '../auth/auth';
import { AuthenticationError } from '../../common/errors';

const detectLocalRoles =
  userPlaceRole =>
    (userPlaceRole && userPlaceRole.get('role') === 'place_admin' ? [ROLES.OWNER] : []);

/**
 *
 * @param {object} req Express request object
 * @param {uuid} placeId Of the place to validate the user against
 * @returns {Promise.<Array<string>>}
 */
export function validateUserPlaceRoleAndGetLocalRolesForPlace(req, placeId) {
  return BPromise
    .resolve(get(req, 'user.userId'))
    .tap(tippiqUserId => {
      if (!tippiqUserId) {
        throw new AuthenticationError('Not authenticated');
      }
    })
    .then(tippiqUserId =>
      UserPlaceRoleRepository
        .getUserPlaceRoleByTippiqUserIdAndPlace(tippiqUserId, placeId)
        .catch(UserPlaceRole.NotFoundError, () => {
          throw new AuthenticationError('No user_place_role for place');
        }))
    .then(detectLocalRoles);
}

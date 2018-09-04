/**
 * Response handler for user-place-roles/get-user-place-roles.
 * @module modules/user-place-roles/actions/get-user-place-roles
 */

import debugLogger from 'debugnyan';
import BPromise from 'bluebird';

import { UserPlaceRole } from '../models';
import { UserPlaceRoleRepository } from '../repositories';
import { sendError, catchInvalidUUIDError } from '../../../common/route-utils';
import { AuthenticationError } from '../../../common/errors';
import { GET_USER_PLACE_ROLES } from '../../auth/permissions';
import { validatePermissions } from '../../auth/auth';
import { getDisplayName } from './get-display-name';
import {
  validateUserPlaceRoleAndGetLocalRolesForPlace,
} from '../../user-place-roles/user-place-role-utils';

const debug = debugLogger('tippiq-places:user-place-roles:actions:get-user-place-roles');

/**
 * Response handler for getting user place roles by place Id.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const placeId = req.params.placeId;

  validateUserPlaceRoleAndGetLocalRolesForPlace(req, placeId)
    .tap(localRoles => validatePermissions(req, res, GET_USER_PLACE_ROLES, localRoles))
    .then(() => UserPlaceRoleRepository.findByPlaceId(placeId))
    .then(userPlaceRoles => userPlaceRoles.serialize({ context: 'place:user-place-role' }))
    .then(userPlaceRoles => BPromise
      .all(
        userPlaceRoles.map(userPlaceRole =>
          getDisplayName(userPlaceRole.tippiqId)
            .then(displayName =>
              ({
                ...userPlaceRole,
                displayName,
              })
            )
            .catch(() => userPlaceRole)
        )
      )
    )
    .then(result => {
      res.json(result);
    })
    .catch(UserPlaceRole.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
    .catch(e => catchInvalidUUIDError(res, e))
    .catch(AuthenticationError, () => sendError(res, 403, 'Geen toegang.'))
    .catch(e => {
      debug.error(`Server error: ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}

/**
 * Response handler for places/delete-place.
 * @module modules/places/actions/delete-place
 */

import debugLogger from 'debugnyan';

import { Place } from '../models';
import { PlaceRepository } from '../repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import { UserPlaceRole } from '../../user-place-roles/models';
import { sendSuccess, sendError, catchInvalidUUIDError } from '../../../common/route-utils';
import { DELETE_PLACE } from '../../auth/permissions';
import { validatePermissions, ROLES } from '../../auth/auth';

const debug = debugLogger('tippiq-places:places:actions:delete-place');

/**
 * Response handler for deleting a place.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const tippiqUserId = req.user && req.user.userId ? req.user.userId : null;
  if (tippiqUserId === null) {
    sendError(res, 403, 'Geen toegang.');
  } else {
    UserPlaceRoleRepository.getUserPlaceRoleByTippiqUserIdAndPlace(tippiqUserId, req.params.id)
      .tap(userPlaceRole => {
        const localRoles = userPlaceRole && userPlaceRole.get('role') === 'place_admin' ? [ROLES.OWNER] : [];
        return validatePermissions(req, res, DELETE_PLACE, localRoles);
      })
      .then(() =>
        PlaceRepository
          .deleteById(req.params.id)
          .then(() => (sendSuccess(res, 200, `Removed place with id ${req.params.id}`)))
          .catch(Place.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
          .catch(e => catchInvalidUUIDError(res, e))
          .catch(e => {
            debug.error(`Error delete place '${req.params.id}': ${e.message} ${e.stack}`);
            sendError(res, 500, 'Serverfout.');
          })
      )
      .catch(UserPlaceRole.NotFoundError, () => sendError(res, 403, 'Geen toegang.'))
      .catch(e => {
        debug.error(`Error delete place responsehandler: ${e.message} ${e.stack}`);
        sendError(res, 500, 'Serverfout.');
      });
  }
}

/**
 * Response handler for places/get-place.
 * @module modules/places/actions/get-policy
 */

import debugLogger from 'debugnyan';

import { Place } from '../models';
import { PlaceRepository } from '../repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import { UserPlaceRole } from '../../user-place-roles/models';
import { sendError, catchInvalidUUIDError } from '../../../common/route-utils';
import { GET_PLACE } from '../../auth/permissions';
import { validatePermissions, ROLES } from '../../auth/auth';

const debug = debugLogger('tippiq-places:places:actions:get-place');

/**
 * Response handler for getting a place.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const tippiqUserId = req.user && req.user.userId ? req.user.userId : null;
  if (tippiqUserId === null) {
    sendError(res, 403, 'Geen toegang.');
  }
  UserPlaceRoleRepository.getUserPlaceRoleByTippiqUserIdAndPlace(tippiqUserId, req.params.id)
    .tap(userPlaceRole => {
      const localRoles = userPlaceRole && userPlaceRole.get('role') === 'place_admin' ? [ROLES.OWNER] : [];
      return validatePermissions(req, res, GET_PLACE, localRoles);
    })
    .then(() =>
      PlaceRepository
        .findById(req.params.id)
        .then(place => res.json(place.serialize({ context: 'place' })))
        .catch(Place.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
        .catch(e => catchInvalidUUIDError(res, e))
        .catch(e => {
          debug.error(`Error get place '${req.params.id}': ${e.message} ${e.stack}`);
          sendError(res, 500, 'Serverfout.');
        })
    )
    .catch(UserPlaceRole.NotFoundError, () => sendError(res, 403, 'Geen toegang.'))
    .catch(e => {
      debug.error(`Error get place responsehandler: ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}

/**
 * Response handler for attributes/delete-attribute.
 * @module modules/attributes/actions/delete-attribute
 */

import debugLogger from 'debugnyan';
import { Attribute } from '../models';
import { UserPlaceRole } from '../../user-place-roles/models';
import { AttributeRepository } from '../repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import { sendSuccess, sendError, catchInvalidUUIDError } from '../../../common/route-utils';
import { DELETE_ATTRIBUTE } from '../../auth/permissions';
import { validatePermissions, ROLES } from '../../auth/auth';

const debug = debugLogger('tippiq-places:attributes:actions:delete-attribute');

/**
 * Response handler for deleting an attribute.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const tippiqUserId = req.user && req.user.userId ? req.user.userId : null;
  return UserPlaceRoleRepository
    .getUserPlaceRoleByTippiqUserIdAndPlace(tippiqUserId, req.params.placeId)
    .tap(userPlaceRole => {
      const localRoles = userPlaceRole && userPlaceRole.get('role') === 'place_admin' ? [ROLES.OWNER] : [];
      return validatePermissions(req, res, DELETE_ATTRIBUTE, localRoles);
    })
    .then(() => AttributeRepository.deleteById(req.params.id))
    .then(() => sendSuccess(res, 200, `Removed attribute with id ${req.params.id}`))
    .catch(UserPlaceRole.NotFoundError, () => sendError(res, 403, 'Geen toegang.'))
    .catch(Attribute.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
    .catch(e => catchInvalidUUIDError(res, e))
    .catch(e => {
      debug.error(`Error delete attribute with id: '${req.params.id}': ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}

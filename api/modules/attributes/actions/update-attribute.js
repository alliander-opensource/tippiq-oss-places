/**
 * Response handler for attributes/update-attribute.
 * @module modules/attributes/actions/update-attribute
 */

import debugLogger from 'debugnyan';

import { Attribute } from '../models';
import { AttributeRepository } from '../repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import validateAttribute from '../attribute-validation';
import { ADD_ATTRIBUTE } from '../../auth/permissions';
import { ValidationError } from '../../../common/errors';
import { sendError } from '../../../common/route-utils';
import { validatePermissions, ROLES } from '../../auth/auth';

const debug = debugLogger('tippiq-places:attributes:actions:update-attribute');

/**
 * Response handler for updating an attribute.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const tippiqUserId = req.user && req.user.userId ? req.user.userId : null;
  UserPlaceRoleRepository
    .getUserPlaceRoleByTippiqUserIdAndPlace(tippiqUserId, req.params.placeId)
    .tap(userPlaceRole => {
      const localRoles = userPlaceRole && userPlaceRole.get('role') === 'place_admin' ? [ROLES.OWNER] : [];
      return validatePermissions(req, res, ADD_ATTRIBUTE, localRoles);
    })
    .then(() => validateAttribute({
      place_id: req.params.placeId,
      type: req.body.data ? req.body.data.attributeType || req.body.data.type : null,
      data: req.body.data ? req.body.data : null,
    }))
    .then(attribute => AttributeRepository.updateById(req.params.id, attribute))
    .then(attribute => res.json(attribute.serialize({ context: 'attribute' })))
    .catch(Attribute.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
    .catch(ValidationError, e => sendError(res, 400, `Validatiefout: ${e.message}.`))
    .catch(e => {
      debug.error(`Error update attribute, body: '${req.body.data}':
          ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}

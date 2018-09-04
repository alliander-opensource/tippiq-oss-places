/**
 * Response handler for attributes/add-attribute.
 * @module modules/attributes/actions/add-attribute
 */

import debugLogger from 'debugnyan';

import { AttributeRepository } from '../repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import validateAttribute from '../attribute-validation';
import { ADD_ATTRIBUTE } from '../../auth/permissions';
import { ValidationError } from '../../../common/errors';
import { sendError } from '../../../common/route-utils';
import { validatePermissions, ROLES } from '../../auth/auth';

const debug = debugLogger('tippiq-places:attributes:actions:add-attribute');

/**
 * Creates an attribute in the database
 * @function createAttribute
 * @param {object} newAttribute New attribute json
 * @returns {Object} Attribute instance
 */
export function createAttribute(newAttribute) {
  return validateAttribute(newAttribute)
    .then(attribute => AttributeRepository.create(attribute));
}

/**
 * Response handler for adding an attribute.
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
    .then(() => createAttribute({
      place_id: req.params.placeId,
      type: req.body.data ? req.body.data.attributeType || req.body.data.type : null,
      data: req.body.data ? req.body.data : null,
    }))
    .then(attribute => {
      res
        .status(201)
        .json({
          success: false,
          attribute: attribute.serialize('attribute'),
        });
    })
    .catch(ValidationError, e => {
      debug.debug(`ValidationError on add attribute: ${e.message} ${e.stack}`);
      res
        .status(400)
        .json({
          success: false,
          message: e.message,
        });
    })
    .catch(e => {
      debug.error(`Error add attribute: ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}

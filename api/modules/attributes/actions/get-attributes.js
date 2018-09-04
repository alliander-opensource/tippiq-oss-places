/**
 * Response handler for attributes/get-attribute.
 * @module modules/attributes/actions/get-policy
 */

import debugLogger from 'debugnyan';
import BPromise from 'bluebird';
import { Attribute } from '../models';
import { UserPlaceRole } from '../../user-place-roles/models';
import { AttributeRepository } from '../repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import { PolicyRepository } from '../../policies/repositories';
import { Policy } from '../../policies/models';
import { sendError, catchInvalidUUIDError } from '../../../common/route-utils';
import { GET_ATTRIBUTES } from '../../auth/permissions';
import { validatePermissions, ROLES } from '../../auth/auth';

const debug = debugLogger('tippiq-places:attributes:actions:get-attributes');

/**
 * filter attributes with Policies set
 * @function filterWithPolicies
 * @param {array} attributes Attributes to filter
 * @param {string} clientId Client Id
 * @param {string} tippiqUserId Tippiq user Id
 * @param {string} placeId Place Id
 * @returns {BPromise} filtered attributes
 */
function filterWithPolicies(attributes, clientId, tippiqUserId, placeId) {
  return BPromise.filter(attributes, attribute =>
    PolicyRepository
      .findOne({
        user_id: tippiqUserId,
        service_provider_id: clientId,
        template_slug: attribute.data.attributeType,
        place_id: placeId,
      })
      .then(() => BPromise.resolve(true))
      .catch(Policy.NotFoundError, () => BPromise.resolve(false))
  );
}

/**
 * Response handler for getting attributes.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const tippiqUserId = req.user && req.user.userId ? req.user.userId : null;
  const placeId = req.user.placeId;

  debug.info({ tippiqUserId, placeId });

  if (tippiqUserId === null) {
    sendError(res, 403, 'Geen toegang.');
  } else { // either req as third party with clientId or as user with userId
    UserPlaceRoleRepository
      .getUserPlaceRoleByTippiqUserIdAndPlace(tippiqUserId, placeId)
      .tap(userPlaceRole => {
        const localRoles = userPlaceRole && userPlaceRole.get('role') === 'place_admin' ? [ROLES.OWNER] : [];
        return validatePermissions(req, res, GET_ATTRIBUTES, localRoles);
      })
      .then(() => {
        const searchOptions = { place_id: placeId };
        if (req.query.type) {
          searchOptions.type = req.query.type;
        }
        return AttributeRepository.findAll(searchOptions);
      })
      .then(attributesModel => {
        const attributes = attributesModel.serialize({ context: 'attribute' });
        // If accesstoken is used to retrieve attributes, check if required policies are set.
        return req.user.strategy === 'OAuth2AccessToken' ?
          filterWithPolicies(attributes, req.user.clientId, tippiqUserId, placeId) : attributes;
      })
      .then(attributes => res.json(attributes))
      .catch(UserPlaceRole.NotFoundError, () => sendError(res, 403, 'Geen toegang.'))
      .catch(Attribute.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
      .catch(e => catchInvalidUUIDError(res, e))
      .catch(e => {
        debug.error(`Error get attributes with placeId: '${placeId}', type: '${req.query.type}':
          ${e.message} ${e.stack}`);
        sendError(res, 500, 'Serverfout.');
      });
  }
}

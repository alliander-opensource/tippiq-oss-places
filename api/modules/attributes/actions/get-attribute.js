/**
 * Response handler for attributes/get-attribute.
 * @module modules/attributes/actions/get-policy
 */
import debugLogger from 'debugnyan';
import { Attribute } from '../models';
import { UserPlaceRole } from '../../user-place-roles/models';
import { AttributeRepository } from '../repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import { PolicyRepository } from '../../policies/repositories';
import { Policy } from '../../policies/models';
import { sendError, catchInvalidUUIDError } from '../../../common/route-utils';
import { GET_ATTRIBUTE } from '../../auth/permissions';
import { validatePermissions, ROLES } from '../../auth/auth';

const debug = debugLogger('tippiq-places:attributes:actions:get-attribute');

/**
 * Response handler for getting an attribute.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const tippiqUserId = req.user && req.user.userId ? req.user.userId : null;

  if (tippiqUserId === null) {
    sendError(res, 403, 'Geen toegang.');
  } else if (req.user && req.user.strategy === 'OAuth2AccessToken') {
    PolicyRepository
      .findOne({
        user_id: tippiqUserId,
        service_provider_id: req.user.clientId,
        template_slug: req.query.type,
      })
      .then(() =>
        AttributeRepository.findOne({ place_id: req.params.placeId, type: req.query.type }))
      .then(attribute => res.json(attribute.serialize({ context: 'attribute' })))
      .catch(Policy.NotFoundError, () => sendError(res, 403, 'Geen toestemming, attribuut niet ingesteld.'))
      .catch(e => {
        debug.error(`Error get attribute: ${e.message} ${e.stack}`);
        sendError(res, 500, 'Serverfout.');
      });
  } else {
    UserPlaceRoleRepository
      .getUserPlaceRoleByTippiqUserIdAndPlace(tippiqUserId, req.params.placeId)
      .tap(userPlaceRole => {
        const localRoles = userPlaceRole && userPlaceRole.get('role') === 'place_admin' ? [ROLES.OWNER] : [];
        return validatePermissions(req, res, GET_ATTRIBUTE, localRoles);
      })
      .then(() => AttributeRepository.findById(req.params.id))
      .then(attribute => res.json(attribute.serialize({ context: 'attribute' })))
      .catch(UserPlaceRole.NotFoundError, () => sendError(res, 403, 'Geen toegang.'))
      .catch(Attribute.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
      .catch(e => catchInvalidUUIDError(res, e))
      .catch(e => {
        debug.error(`Error get attribute with placeId: '${req.params.placeId}', type: '${req.query.type}':
          ${e.message} ${e.stack}`);
        sendError(res, 500, 'Serverfout.');
      });
  }
}

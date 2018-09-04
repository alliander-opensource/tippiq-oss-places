/**
 * Response handler for places/get-place.
 * @module modules/places/actions/get-policy
 */

import debugLogger from 'debugnyan';

import { ServiceProvider } from '../../service-provider/models';
import { ServiceProviderRepository } from '../../service-provider/repositories';
import { sendError, catchInvalidUUIDError } from '../../../common/route-utils';
import { AuthenticationError } from '../../../common/errors';
import { GET_PLACE_SERVICES } from '../../auth/permissions';
import { validatePermissions } from '../../auth/auth';
import {
  validateUserPlaceRoleAndGetLocalRolesForPlace,
} from '../../user-place-roles/user-place-role-utils';

const debug = debugLogger('tippiq-places:places:actions:get-services');

/**
 * Response handler for getting services of a place.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const placeId = req.params.id;

  validateUserPlaceRoleAndGetLocalRolesForPlace(req, placeId)
    .tap(localRoles => validatePermissions(req, res, GET_PLACE_SERVICES, localRoles))
    .then(() => ServiceProviderRepository.findByPlaceId(placeId))
    .then(serviceProviders => serviceProviders.serialize({ context: 'service-provider-resources' }))
    .then(serviceProviders => {
      res.json(serviceProviders);
    })
    .catch(ServiceProvider.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
    .catch(e => catchInvalidUUIDError(res, e))
    .catch(AuthenticationError, () => sendError(res, 403, 'Geen toegang.'))
    .catch(e => {
      debug.error(`Server error placeId=${placeId}: ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}

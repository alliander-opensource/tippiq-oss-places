/**
 * Response handler for user-place-roles/get-display-name.
 * @module modules/user-place-roles/actions/get-display-name
 */

import debugLogger from 'debugnyan';
import superagent from 'superagent';

import { tippiqIdBaseUrl } from '../../../config';

import { sendError } from '../../../common/route-utils';
import { GET_USER_PLACE_ROLES } from '../../auth/permissions';
import {
  validatePermissions,
  getSignedPlacesServiceJwt,
} from '../../auth/auth';
import { AuthenticationError } from '../../../common/errors';
import {
  validateUserPlaceRoleAndGetLocalRolesForPlace,
} from '../../user-place-roles/user-place-role-utils';

const debug = debugLogger('tippiq-places:user-place-roles:actions:get-display-name');

/**
 * Get the display name for the user at tippiq-id
 * @function getDisplayName
 * @param {string} userId Uuid of the tippiq-id user
 * @return {Promise.<string>}
 */
export function getDisplayName(userId) {
  debug.debug({ userId });
  return getSignedPlacesServiceJwt({ action: 'tippiq_id.get_user_display_name' })
    .then(tippiqPlacesServiceToken =>
      superagent
        .get(`${tippiqIdBaseUrl}/api/users/${userId}/display-name`)
        .set('Authorization', `Bearer ${tippiqPlacesServiceToken}`)
        .set('Content-Type', 'application/json')
        .send()
    )
    .then(response => response.body.displayName);
}
/**
 * Response handler for getting a display name.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const { userId, placeId } = req.params;

  validateUserPlaceRoleAndGetLocalRolesForPlace(req, placeId)
    .tap(localRoles => validatePermissions(req, res, GET_USER_PLACE_ROLES, localRoles))
    .then(() => getDisplayName(userId))
    .then(displayName => res.json({ success: true, displayName }))
    .catch(AuthenticationError, () => sendError(res, 403, 'Geen toegang.'))
    .catch(e => {
      debug.warn(`Server error: ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}

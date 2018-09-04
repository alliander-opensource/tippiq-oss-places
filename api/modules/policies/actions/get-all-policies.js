/**
 * Response handler for policies/get-all-policies.
 * @module modules/policies/actions/get-all-policies
 */

import debugLogger from 'debugnyan';

import { PolicyRepository } from '../repositories';
import { sendError } from '../../../common/route-utils';
import { GET_ALL_POLICIES } from '../../auth/permissions';
import { validatePermissions } from '../../auth/auth';

const debug = debugLogger('tippiq-places:policies:actions:get-all-policies');

/**
 * Response handler for getting all policies.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  debug.debug('get all policies');

  const clientId = (req.user && req.user.clientId) ? req.user.clientId : req.query.clientId;
  const placeId = req.params.placeId;

  if (req.user && !clientId) {
    sendError(res, 400, 'clientId is vereist.');
  } else {
    const options = { service_provider_id: clientId, place_id: placeId };
    if (req.user && req.user.userId) {
      options.user_id = req.user.userId;
    }

    validatePermissions(req, res, GET_ALL_POLICIES)
      .then(() => PolicyRepository.findAll(options))
      .then(policies => res.json(policies.serialize({ context: 'policy' })));
  }
}

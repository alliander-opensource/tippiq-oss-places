/**
 * Response handler for policies/add-policy.
 * @module modules/policies/actions/add-policy
 */

import debugLogger from 'debugnyan';

import { Policy } from '../models';
import { PolicyRepository } from '../repositories';
import { sendError, catchInvalidUUIDError } from '../../../common/route-utils';
import { GET_POLICY } from '../../auth/permissions';
import { validatePermissions, ROLES } from '../../auth/auth';

const debug = debugLogger('tippiq-places:policies:actions:get-policy');

/**
 * Response handler for getting a policy.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  PolicyRepository
    .findById(req.params.id)
    .tap((policy) => {
      const localRoles = [];
      if (req.user && req.user.userId && policy.get('userId') === req.user.userId) {
        localRoles.push(ROLES.OWNER);
      }
      return validatePermissions(req, res, GET_POLICY, localRoles);
    })
    .then(policy => res.json(policy.serialize({ context: 'policy' })))
    .catch(Policy.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
    .catch(e => catchInvalidUUIDError(res, e))
    .catch(e => {
      debug.warn(`Error get policy: ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}

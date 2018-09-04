/**
 * Response handler for policies/delete-policy.
 * @module modules/policies/actions/delete-policy
 */

import debugLogger from 'debugnyan';

import { Policy } from '../models';
import { PolicyRepository } from '../repositories';
import { sendSuccess, sendError, catchInvalidUUIDError } from '../../../common/route-utils';
import { DELETE_POLICY } from '../../auth/permissions';
import { validatePermissions, ROLES } from '../../auth/auth';

const debug = debugLogger('tippiq-places:policies:actions:delete-policy');

/**
 * Response handler for deleting a policy.
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
      return validatePermissions(req, res, DELETE_POLICY, localRoles);
    })
    .then(policy => PolicyRepository.deleteById(policy.get('id')))
    .then(() => sendSuccess(res, 200, `Removed policy with id ${req.params.id}`))
    .catch(Policy.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
    .catch(e => catchInvalidUUIDError(res, e))
    .catch(e => {
      debug.warn(`Error delete policy: ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}

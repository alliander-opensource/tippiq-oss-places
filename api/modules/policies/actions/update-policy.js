/**
 * Response handler for policies/update-policy.
 * @module modules/policies/actions/update-policy
 */

import debugLogger from 'debugnyan';

import { Policy } from '../models';
import validatePolicy from '../policy-validation';
import { PolicyRepository } from '../repositories';
import { ValidationError } from '../../../common/errors';
import { sendError } from '../../../common/route-utils';
import { UPDATE_POLICY } from '../../auth/permissions';
import { validatePermissions, ROLES } from '../../auth/auth';

const debug = debugLogger('tippiq-places:policies:actions:update-policy');

/**
 * Response handler for updating a policy.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  debug.debug('update policy');
  const placeId = req.params.placeId;

  validatePolicy({ ...req.body, placeId })
    .then(() => PolicyRepository.findById(req.params.id))
    .tap(policy => {
      const localRoles = [];
      if (req.user && req.user.userId && policy.get('userId') === req.user.userId) {
        localRoles.push(ROLES.OWNER);
      }
      return validatePermissions(req, res, UPDATE_POLICY, localRoles);
    })
    .then(policy => PolicyRepository.updateById(policy.get('id'), req.body))
    .then(policy => res.json(policy.serialize({ context: 'policy' })))
    .catch(Policy.NotFoundError, () => sendError(res, 404, 'Niet gevonden.'))
    .catch(ValidationError, e => sendError(res, 400, `Validatiefout: ${e.message}.`))
    .catch(e => {
      debug.warn(`Error get policy: ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}

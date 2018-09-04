/**
 * Response handler for policies/add-policy.
 * @module modules/policies/actions/add-policy
 */

import BPromise from 'bluebird';
import debugLogger from 'debugnyan';
import _ from 'lodash';
import { PolicyRepository } from '../repositories';
import { sendCreated, sendCreatedMultiple, sendError } from '../../../common/route-utils';
import validatePolicy from '../policy-validation';
import { ADD_POLICY } from '../../auth/permissions';
import { validatePermissions, ROLES } from '../../auth/auth';
import bookshelf from '../../../common/bookshelf';
import sendPoliciesSetEmail from '../send-policies-set-email';

const debug = debugLogger('tippiq-places:policies:actions:add-policy');

/**
 * Save a policy
 * @function savePolicy
 * @param {Object} rawPolicy Raw policy object.
 * @param {Object} transaction Database transaction.
 * @param {string} userId User Id.
 * @returns {undefined}
 */
export function savePolicy(rawPolicy, transaction, userId) {
  return validatePolicy(rawPolicy)
    .then(policy => {
      if (policy.enabled) {
        return PolicyRepository
          .findOne({
            template_slug: policy.templateSlug,
            service_provider_id: policy.serviceProviderId,
            user_id: userId,
            place_id: policy.placeId,
          })
          .catch(() =>
            PolicyRepository.create(
              _.omit(policy, 'enabled'), { transacting: transaction }
            )
          );
      }
      return PolicyRepository.deleteWhere(
        {
          template_slug: policy.templateSlug,
          service_provider_id: policy.serviceProviderId,
          user_id: userId,
          place_id: policy.placeId,
        },
        { transacting: transaction }
      );
    });
}

/**
 * Save array of policies
 * @function savePolicies
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {string} userId User Id.
 * @returns {undefined}
 */
function savePolicies(req, res, userId) {
  const localRoles = [];
  const placeId = req.params.placeId;
  return bookshelf.transaction(transaction => {
    if (req.body
        .map(rawPolicy => userId === rawPolicy.userId)
        .indexOf(false) === -1) {
      localRoles.push(ROLES.OWNER);
    }

    return validatePermissions(req, res, ADD_POLICY, localRoles)
      .then(() =>
        BPromise.all(req.body.map(rawPolicy =>
          savePolicy({ ...rawPolicy, placeId }, transaction, userId)))
      );
  });
}

/**
 * Response handler for adding one or multiple policies.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const clientId = (req.user && req.user.clientId) ? req.user.clientId : req.query.clientId;
  const userId = req.user ? req.user.userId : null;
  const placeId = req.params.placeId;

  if (req.body instanceof Array) {
    savePolicies(req, res, userId)
      .then(policyModels => policyModels.filter(model => !Array.isArray(model)))
      .tap(policies => sendPoliciesSetEmail(clientId, req.user.userId, policies))
      .then(policies => policies.map(policy => policy.get('id')))
      .then(policyIds => sendCreatedMultiple(res, policyIds))
      .catch(e => {
        debug.warn(`Error add policies: ${e.message} ${e.stack}`);
        sendError(res, 500, 'Serverfout.');
      });
  } else {
    const localRoles = [];
    validatePolicy({ ...req.body, placeId })
      .tap(policy => {
        if (req.user && req.user.userId && policy.userId === req.user.userId) {
          localRoles.push(ROLES.OWNER);
        }
        return validatePermissions(req, res, ADD_POLICY, localRoles);
      })
      .then(policy => PolicyRepository.create(policy))
      .tap(policy => sendPoliciesSetEmail(clientId, req.user.userId, policy))
      .then(policy => sendCreated(res, policy.get('id')))
      .catch(e => {
        debug.warn(`Error add policy: ${e.message} ${e.stack}`);
        sendError(res, 500, 'Serverfout.');
      });
  }
}

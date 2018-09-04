/**
 * Response handler for quick-registration/quick-registration.
 * @module modules/quick-registration/actions/quick-registration
 */
import debugLogger from 'debugnyan';
import BPromise from 'bluebird';
import { PlaceRepository } from '../../places/repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import { ServiceProviderRepository } from '../../service-provider/repositories';
import { sendError } from '../../../common/route-utils';
import { ValidationError, AuthenticationError } from '../../../common/errors';
import { ACTIONS, validateServicePermissions, getSignedPlaceJwt } from '../../auth/auth';
import { createAttribute } from '../../attributes/actions/add-attribute';
import { PolicyRepository } from '../../policies/repositories';
import { createAccessToken } from '../../oauth2';

const debug = debugLogger('tippiq-places:quick-registration:actions:quick-registration');

/**
 * Get valid serviceProvider from policies collection
 * @function validatePoliciesAndGetServiceProviderId
 * @param {Object} policies Array of policies
 * @param {string} slug Slug to match
 * @returns {string} serviceProvider
 */
function validatePoliciesAndGetServiceProviderId(policies) {
  if (!policies || !policies.length || !policies[0].serviceProviderId) {
    throw new ValidationError('Invalid policy object');
  }
  const serviceProviderId = policies[0].serviceProviderId;
  return ServiceProviderRepository
    .findOne({ id: serviceProviderId })
    .then(() => {
      for (const policy of policies) {
        if (policy.serviceProviderId !== serviceProviderId) {
          throw new ValidationError('Policy serviceProviderId\'s should match');
        }
      }
      return serviceProviderId;
    });
}

/**
 * Response handler for quick registration.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const policies = req.body.policies;
  const userId = req.body.userId;
  let clientId;
  let placeId;
  let placeToken;
  validateServicePermissions(req, res, ACTIONS.QUICK_REGISTRATION)
    .tap(() => {
      if (req.user.service !== 'tippiq-id-service') {
        debug.debug(`Unauthorized service: ${req.user.service}`);
        throw new AuthenticationError('Unauthorized.');
      }
    })
    .then(() => validatePoliciesAndGetServiceProviderId(policies))
    .then(serviceProviderId => { clientId = serviceProviderId; })
    .then(() => PlaceRepository.createPlace())
    .then(place => {
      placeId = place.get('id');
      return getSignedPlaceJwt({ placeId }, place.get('private_key'));
    })
    .tap(placeJwt => { placeToken = placeJwt; })
    .tap(() => createAttribute({
      place_id: placeId,
      type: req.body.placeAddress.attributeType,
      data: req.body.placeAddress,
    }))
    .then(() => UserPlaceRoleRepository.create({
      tippiq_id: userId,
      place_id: placeId,
      role: 'place_admin',
    }))
    .tap(() => BPromise.all(policies.map(policy =>
      PolicyRepository.create(Object.assign({}, policy, { userId, placeId }))))
    )
    .then(userPlaceRole => createAccessToken(clientId, userPlaceRole.get('id')))
    .then(accessToken =>
      res
        .cacheControl('no-store')
        .status(201)
        .send({
          success: true,
          message: 'Aangemaakt.',
          placeToken,
          accessToken,
        })
    )
    .catch(AuthenticationError, () => sendError(res, 403, 'Geen toegang.'))
    .catch(e => {
      debug.error(`Failed to perform quick registration for userId: ${userId}`, e);
      sendError(res, 500, 'Serverfout.');
    });
}

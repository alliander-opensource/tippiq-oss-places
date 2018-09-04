/**
 * UserPlaceRole validation.
 * @module user-place-roles/user-place-role-validation
 */

import BPromise from 'bluebird';

import {
  validateUuidField,
  validateRequiredField,
  ValidationError,
} from '../../common/validation-utils';

export { ValidationError };

/**
 * Validate add user place role.
 * @function validateAddUserPlaceRole
 * @param {Object} userPlaceRole UserPlaceRole to be validated.
 * @returns {Promise<Object>} The validated user place role object.
 */
export function validateAddUserPlaceRole(userPlaceRole) {
  return BPromise.resolve(userPlaceRole)
    .tap(validateRequiredField('placeId'))
    .tap(validateRequiredField('role'))
    .tap(validateRequiredField('tippiqId'))
    .tap(validateUuidField('placeId'))
    .tap(validateUuidField('tippiqId'));
}

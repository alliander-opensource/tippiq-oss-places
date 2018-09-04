/**
 * Place validation.
 * @module places/place-validation
 */

import BPromise from 'bluebird';

import {
  validateUuidField,
  ValidationError,
} from '../../common/validation-utils';

export { ValidationError };

/**
 * Validate add place.
 * @function validateAddPlace
 * @param {Object} place Place to be validated.
 * @returns {Promise<Object>} The validated place.
 */
export function validateAddPlace(place) {
  return BPromise.resolve(place)
    .tap(validateUuidField('id'));
}

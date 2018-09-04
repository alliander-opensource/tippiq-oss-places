/**
 * Place validation.
 * @module places/place-validation
 */

import BPromise from 'bluebird';

import { ValidationError } from '../../common/errors';
import { isValidUUID } from '../../common/validation-utils';
import { PlaceRepository } from '../../modules/places/repositories';

/**
 * Validate id.
 * @function validatePlaceId
 * @param {Object} attribute Attribute to be validated.
 * @returns {undefined}
 */
function validatePlaceId(attribute) {
  if (!isValidUUID(attribute.place_id)) {
    throw new ValidationError(`Invalid placeId: ${attribute.place_id} is not a valid UUID.`);
  }
  return BPromise.resolve(attribute);
}

/**
 * Validate place exists.
 * @function validatePlaceExists
 * @param {Object} attribute Attribute to be validated.
 * @returns {undefined}
 */
function validatePlaceExists(attribute) {
  return PlaceRepository.findById(attribute.place_id)
    .then(() => BPromise.resolve(attribute))
    .catch(() => {
      throw new ValidationError(`Invalid placeId: ${attribute.place_id} does not exist.`);
    });
}

/**
 * Validate data.
 * @function validateData
 * @param {Object} attribute Attribute to be validated.
 * @returns {undefined}
 */
function validateData(attribute) {
  if (!attribute.data) {
    throw new ValidationError(`Invalid data: ${attribute.data} is not valid data.`);
  }
  return BPromise.resolve(attribute);
}

/**
 * Validate type.
 * @function validateType
 * @param {Object} attribute Attribute to be validated.
 * @returns {undefined}
 */
function validateType(attribute) {
  if (attribute.type === undefined || attribute.type === '') {
    throw new ValidationError(`Invalid type: ${attribute.type} is not a valid value.`);
  }
  const dataAttributeType = attribute.data.attributeType || attribute.data.type;
  if (attribute.type !== dataAttributeType) {
    throw new ValidationError(`Invalid type: type(${attribute.type}) mismatch with data.type(${dataAttributeType})`);
  }
  return BPromise.resolve(attribute);
}

/**
 * Validate attribute.
 * @function validateAttribute
 * @param {Object} attribute Attribute to be validated.
 * @returns {undefined}
 */
export default function validateAttribute(attribute) {
  return BPromise.resolve(attribute)
    .tap(validatePlaceId)
    .tap(validatePlaceExists)
    .tap(validateData)
    .tap(validateType);
}

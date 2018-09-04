import debugLogger from 'debugnyan';
/**
 * Utility functions for validation.
 * @module common/validation-utils
 */
import { ValidationError } from './errors';

export { ValidationError };

const uuidFormat = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

const debug = debugLogger('tippiq-places:common:validation-utils');

/**
 * Check valid UUID.
 * @function isValidUUID
 * @param {string} input Input to check.
 * @returns {Bool} True if valid UUID.
 */
export function isValidUUID(input) {
  return uuidFormat.test(input);
}

/**
 * Return a function that validates objects to require a field by name.
 * @function validateRequiredField
 * @param {string} name Name of the field that will be validated.
 * @returns {function(object)} Function that validates objects to require the named field.
 */
export function validateRequiredField(name) {
  return (object) => {
    debug.debug({ _function: 'validateRequiredField', name, object });
    if (!(object && object.hasOwnProperty(name))) { // eslint-disable-line no-prototype-builtins
      throw new ValidationError(`Invalid ${name}: missing property.`);
    }
    return object;
  };
}
/**
 * Create a function that validates a named object field to be a uuid.
 * @function validateUuidField
 * @param {Object} name Name of the field that will be validated.
 * @returns {function} Function that validates objects to have the named field be as uuid.
 */
export function validateUuidField(name) {
  return (object) => {
    debug.debug({ _function: 'validateUuid', name, object });
    if (object && object.hasOwnProperty('name')) { // eslint-disable-line no-prototype-builtins
      const uuid = object[name];
      if (!isValidUUID(uuid)) {
        throw new ValidationError(`Invalid ${name}: ${uuid} is not a valid UUID.`);
      }
    }
    return object;
  };
}

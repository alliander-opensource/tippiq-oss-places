/**
 * Validation util.
 * @module util/validation
 */

const isEmpty = value => value === undefined || value === null || value === '';
const join = rules => (value, data) => rules.map(
  rule => rule(value, data)).filter(error => !!error)[0];

/**
 * Email validator.
 * @function email
 * @param {string} value Input value.
 * @returns {string} Error message.
 */
export function email(value) {
  if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return 'Invalid email address';
  }
  return '';
}

/**
 * Password validator.
 * @function password
 * @param {string} value Input value.
 * @returns {string} Error message.
 */
export function password(value) { // eslint-disable-line complexity
  if ((!isEmpty(value)) &&
      ((value.length >= 12 ? 1 : 0) +
       (value.match(/[a-z]/) ? 1 : 0) +
       (value.match(/[A-Z]/) ? 1 : 0) +
       (value.match(/[0-9]/) ? 1 : 0) +
       (value.match(/[^a-zA-Z0-9]/) ? 1 : 0) < 3)) {
    return 'Invalid password';
  }
  return '';
}

/**
 * Required validator.
 * @function required
 * @param {string} value Input value.
 * @returns {string} Error message.
 */
export function required(value) {
  if (isEmpty(value)) {
    return 'Required';
  }
  return '';
}

/**
 * Minumum length validator.
 * @function minLength
 * @param {number} min Minimum length.
 * @returns {Function} Min length validator.
 */
export function minLength(min) {
  return (value) => {
    if (!isEmpty(value) && value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return '';
  };
}

/**
 * Maximum length validator.
 * @function maxLength
 * @param {string} max Maximum length.
 * @returns {Function} Max length validator.
 */
export function maxLength(max) {
  return (value) => {
    if (!isEmpty(value) && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return '';
  };
}

/**
 * Integer validator.
 * @function integer
 * @param {string} value Input value.
 * @returns {string} Error message.
 */
export function integer(value) {
  if (!Number.isInteger(Number(value))) {
    return 'Must be an integer';
  }
  return '';
}

/**
 * One of validator.
 * @function oneOf
 * @param {Array} enumeration Array of valid values.
 * @returns {Function} One of validator.
 */
export function oneOf(enumeration) {
  return (value) => {
    if (!~enumeration.indexOf(value)) { // eslint-disable-line no-bitwise
      return `Must be one of: ${enumeration.join(', ')}`;
    }
    return '';
  };
}

/**
 * Match validator.
 * @function match
 * @param {string} field Field name to be validated.
 * @returns {Function} Match validator.
 */
export function match(field) {
  return (value, data) => {
    if (data) {
      if (value !== data[field]) {
        return 'Do not match';
      }
    }
    return '';
  };
}

/**
 * Create validator.
 * @function createValidator
 * @param {Object} rules Object with rules.
 * @returns {Function} Validator function.
 */
export function createValidator(rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key]));
      const error = rule(data[key], data);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}

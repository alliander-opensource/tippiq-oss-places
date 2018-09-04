/**
 * Custom Errors for use in the API. They can help clarify promise chains by catching specific
 * Errors.
 * @module common/errors
 */
import ExtendableError from 'es6-error';

/**
 * Custom error class for authentication errors.
 * @class AuthenticationError
 * @extends ExtendableError
 */
class AuthenticationError extends ExtendableError {
}

/**
 * Custom error class for validation errors.
 * @class ValidationError
 * @extends ExtendableError
 */
class ValidationError extends ExtendableError {
}

export {
  AuthenticationError,
  ValidationError,
};

/**
 * Utility functions for routing.
 * @module common/route-utils
 */

import debugLogger from 'debugnyan';

const debug = debugLogger('tippiq-places:common:route-utils');
/**
 * Send created message.
 * @function sendCreated
 * @param {Object} res Express response object.
 * @param {string} id Id of the created object.
 * @returns {undefined}
 */
export function sendCreated(res, id) {
  debug.debug({ _function: 'sendCreated', id });
  res
    .set({ Location: `${res.req.baseUrl}/${id}` })
    .status(201)
    .send({
      success: true,
      message: 'Aangemaakt.',
      id,
    });
}

/**
 * Send created message for multiple resources.
 * @function sendCreatedMultiple
 * @param {Object} res Express response object.
 * @param {array} ids Ids of the created objects.
 * @returns {undefined}
 */
export function sendCreatedMultiple(res, ids) {
  debug.debug({ _function: 'sendCreatedMultiple', ids });
  res
    .set({ Location: `${res.req.baseUrl}` })
    .status(201)
    .send({
      success: true,
      message: 'Aangemaakt.',
      ids,
    });
}

/**
 * Send status.
 * @function sendStatus
 * @param {Object} res Express response object.
 * @param {Number} status Status code to be send.
 * @param {Bool} success True if call is success.
 * @param {string} message Message to be send.
 * @returns {undefined}
 */
export function sendStatus(res, status, success, message) {
  debug.debug({ _function: 'sendStatus', status, success, message });
  res
    .status(status)
    .send({
      success,
      message,
    });
}

/**
 * Send error.
 * @function sendStatus
 * @param {Object} res Express response object.
 * @param {Number} status Status code to be send.
 * @param {string} message Message to be send.
 * @returns {undefined}
 */
export function sendError(res, status, message) {
  sendStatus(res, status, false, message);
}

/**
 * Send success.
 * @function sendSuccess
 * @param {Object} res Express response object.
 * @param {Number} status Status code to be send.
 * @param {string} message Message to be send.
 * @returns {undefined}
 */
export function sendSuccess(res, status, message) {
  sendStatus(res, status, true, message);
}

/**
 * Send unauthorized.
 * @function sendUnauthorized
 * @param {Object} res Express response object
 * @param {string} userId Logged in user
 * @param {string} permission Permission needed
 * @returns {undefined}
 */
export function sendUnauthorized(res, userId, permission) {
  sendStatus(res, 403, false, `Gebruiker ${userId} heeft geen toestemming voor ${permission}.`);
}

/**
 * Catch invalid uuid error.
 * @function catchInvalidUUIDError
 * @param {Object} res Express response object.
 * @param {Object} exception Exception object.
 * @returns {undefined}
 */
export function catchInvalidUUIDError(res, exception) {
  if (exception.code === '22P02') {
    debug.debug({ _function: 'catchInvalidUUIDError', exception });
    sendError(res, 400, 'Niet gevonden, ongeldig UUID.');
  } else {
    throw exception;
  }
}

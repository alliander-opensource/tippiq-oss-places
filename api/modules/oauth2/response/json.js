/**
 * Oauth2orize response module.
 * @module modules/oauth2/response/json
 */

/**
 * Sends oauth2orize result back to client as json.
 * @function json
 * @param {Object} txn Oauth2orize transaction.
 * @param {Object} res Express response object.
 * @param {Object} params Oauth2orize response.
 * @param {Function} next Express callback.
 * @returns {Object} Express response.
 */
export default function json(txn, res, params) {
  return res.json(params);
}

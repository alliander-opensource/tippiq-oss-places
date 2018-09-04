/**
 * Response handler for oauth2/verify-redirect-uri.
 * @module modules/oauth2/actions/verify-redirect-uri
 */
import debugLogger from 'debugnyan';

import { sendSuccess, sendError } from '../../../common/route-utils';
import { OAuth2RedirectUriRepository } from '../../../modules/oauth2/repositories';

const debug = debugLogger('tippiq-places:oauth2:actions:verify-redirect-uri');

/**
 * Response handler for verifying a redirect uri.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  OAuth2RedirectUriRepository
    .matchRedirectUri(req.query.clientId, req.query.redirectUri)
    .then(model => {
      if (model) {
        sendSuccess(res, 202, 'Redirect URI bevestigd');
      } else {
        sendError(res, 404, 'Redirect URI niet bevestigd.');
      }
    })
    .catch(e => {
      debug.warn(`Error verifying redirect uri: ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}

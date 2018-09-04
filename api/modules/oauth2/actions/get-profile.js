/**
 * Response handler for oauth2/get-profile.
 * @module modules/oauth2/actions/get-profile
 */
import superagent from 'superagent';
import debugLogger from 'debugnyan';

import config from '../../../config';
import { sendError } from '../../../common/route-utils';
import { OAuth2ClientRepository } from '../../../modules/oauth2/repositories';

const debug = debugLogger('tippiq-places:oauth2:actions:get-profile');

/**
 * Get user profile from TippiqId
 * @function getProfileFromId
 * @param {string} clientId oAuth2 client id
 * @param {string} clientSecret oAuth2 client secret
 * @param {string} tippiqId TippiqId user id
 * @returns {Object} User profile from tippiqId
 */
function getProfileFromId(clientId, clientSecret, tippiqId) {
  return superagent
    .get(`${config.tippiqIdBaseUrl}/api/users/${tippiqId}`)
    .auth(clientId, clientSecret)
    .set('Content-Type', 'application/json')
    .send();
}

/**
 * Response handler for getting a policy.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  OAuth2ClientRepository
    .findOne({ client_id: req.params.clientId })
    .then(client => client.get('clientSecret'))
    .then(clientSecret => getProfileFromId(req.params.clientId, clientSecret, req.params.userId))
    .then(response => res.json({ scrambledEmail: response.body.scrambledEmail }))
    .catch(e => {
      debug.warn(`Error get profile: ${e.message} ${e.stack}`);
      sendError(res, 500, 'Serverfout.');
    });
}

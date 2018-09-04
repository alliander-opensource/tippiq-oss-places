/**
 * Response handler for messages/send-rendered-email.
 * @module modules/messages/actions/send-rendered-email
 */
import debugLogger from 'debugnyan';
import superagent from 'superagent';
import { PolicyRepository } from '../../policies/repositories';
import { Policy } from '../../policies/models';
import { sendError, sendSuccess } from '../../../common/route-utils';
import { ACTIONS, validateServicePermissions, getSignedPlacesServiceJwt } from '../../auth/auth';
import config from '../../../config';

const debug = debugLogger('tippiq-places:messages:actions:send-rendered-email');

const EMAIL_NOT_VERIFIED_STATUS_CODE = 412;

/**
 * Response handler for sending a rendered email.
 * The body contains a rendered Nunjucks email with attributes;
 *  - userId (the Tippiq ID)
 *  - serviceProviderId (the ServiceProviderId)
 *  - html (the html rendered string)
 *  - text (the plain text e-mail)
 *  - subject (the subject of the e-mail)
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const userId = req.body.userId;
  const serviceProviderId = req.body.serviceProviderId;
  validateServicePermissions(req, res, ACTIONS.SEND_MESSAGE)
    .then(() => PolicyRepository.findOne(
      {
        place_id: req.params.placeId,
        user_id: userId,
        service_provider_id: serviceProviderId,
        template_slug: 'tippiq_Tippiq_hood_tippiq_newsletter', // TODO Make more generic one day
      }
    ))
    .then(() => getSignedPlacesServiceJwt({ action: 'tippiq_id.user-send-rendered-mail' }))
    .then(tippiqPlacesServiceToken => {
      superagent
        .post(`${config.tippiqIdBaseUrl}/api/users/${userId}/messages/email`)
        .set('Authorization', `Bearer ${tippiqPlacesServiceToken}`)
        .set('Content-Type', 'application/json')
        .send(req.body)
        .end((err, response) => {
          if ((err || !response.ok) && response.statusCode !== EMAIL_NOT_VERIFIED_STATUS_CODE) {
            debug.error(`Failed to use e-mail service for userId ${userId} with placeId: ${req.params.placeId}`, err);
            sendError(res, 500, 'Mailserver fout.');
          } else {
            sendSuccess(res, 204, 'Bericht verwerkt.');
          }
        });
    })
    .catch(Policy.NotFoundError, () => sendSuccess(res, 204, 'Bericht verwerkt.'))
    .catch(e => {
      debug.error(`Failed to send message for userId ${userId} with placeId: ${req.params.placeId}`, e);
      sendError(res, 500, 'Serverfout.');
    });
}

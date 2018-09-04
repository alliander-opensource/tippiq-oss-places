import _ from 'lodash';
import BPromise from 'bluebird';
import superagent from 'superagent';
import config from '../../config';
import { ServiceProviderRepository } from '../service-provider/repositories';
import { OAuth2ClientRepository } from '../oauth2/repositories';

/**
 * Function to send a mail via tippiq-id to the user identified by userId.
 * @function sendPoliciesSetEmail
 * @param {string} clientId UUID of the serviceProvider that
 * @param {string} userId To send email for.
 * @param {Object|Array} policiesObjectOrArray The policies to include in the email.
 * @returns {Promise<Object|Array>} policiesObjectOrArray
 */
export default (clientId, userId, policiesObjectOrArray) => BPromise
  .all([
    OAuth2ClientRepository
      .findOne({ client_id: clientId })
      .then(client => client.get('clientSecret')),
    _.castArray(policiesObjectOrArray).map(policy => ({ title: policy.get('title') })),
    ServiceProviderRepository
      .findById(clientId)
      .then(client => client.get('name')),
  ])
  .spread((clientSecret, policies, serviceName) => {
    const requestBody = {
      data: {
        frontendBaseUrl: config.emailFrontendBaseUrl,
        serviceName,
        policies,
      },
      from: config.emailFromAddress,
      subject: 'Je ingestelde huisregels',
      templateName: 'policies-set',
      userId,
    };
    return superagent
      .post(`${config.tippiqIdBaseUrl}/api/email/send`)
      .auth(clientId, clientSecret)
      .set('Content-Type', 'application/json')
      .send(requestBody);
  }).return(policiesObjectOrArray);

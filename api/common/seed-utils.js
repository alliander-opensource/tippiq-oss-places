/**
 * Utility functions for seeding.
 * @module common/seed-utils
 */
import BPromise from 'bluebird';
import fs from 'fs-promise';
import debugLogger from 'debugnyan';
import testOauth2Client from '../testdata/oauth2-client';
import testOauth2AUthorizationCode from '../testdata/oauth2-authorization-code';
import testPolicyTemplateReadData from '../testdata/policy-template-read-data';
import testPolicyTemplateShareData from '../testdata/policy-template-share-data';
import fake3pServiceProvider from '../testdata/fake3p-service-provider';
import locationUser from '../testdata/location-user';
import locationPlace from '../testdata/location-place';
import locationPolicy from '../testdata/location-policy';
import locationAccessToken from '../testdata/location-access-token';
import {
  OAuth2ClientRepository,
  OAuth2AuthorizationCodeRepository,
  OAuth2AccessTokenRepository,
} from '../modules/oauth2/repositories';
import { PolicyTemplateRepository } from '../modules/policy-templates/repositories';
import { ServiceProviderRepository } from '../modules/service-provider/repositories';
import { PolicyRepository } from '../modules/policies/repositories';
import { PlaceRepository } from '../modules/places/repositories';
import { UserPlaceRoleRepository } from '../modules/user-place-roles/repositories';

const logger = debugLogger('tippiq-places:common:seed-utils');

/**
 * Insert test oauth2 client.
 * @function insertTestClient
 * @returns {undefined}
 */
export function insertTestClient() {
  return OAuth2ClientRepository.create(testOauth2Client, { method: 'insert' });
}

/**
 * Remove test oauth2 client.
 * @function removeTestClient
 * @returns {undefined}
 */
export function removeTestClient() {
  return OAuth2ClientRepository.deleteById(testOauth2Client.id)
    .catch(e => {
      logger.warn('removeTestClient', e.message);
    });
}

/**
 * Insert policy templates
 * @function insertPolicyTemplates
 * @returns {undefined}
 */
export function insertPolicyTemplates() {
  return BPromise.all([
    PolicyTemplateRepository.create(testPolicyTemplateReadData, { method: 'insert' }),
    PolicyTemplateRepository.create(testPolicyTemplateShareData, { method: 'insert' }),
  ]);
}

/**
 * Remove policy templates
 * @function removePolicyTemplates
 * @returns {undefined}
 */
export function removePolicyTemplates() {
  return BPromise.all([
    PolicyTemplateRepository.deleteById(testPolicyTemplateReadData.id)
      .catch(e => {
        logger.warn('removePolicyTemplates read', e.message);
      }),
    PolicyTemplateRepository.deleteById(testPolicyTemplateShareData.id)
      .catch(e => {
        logger.warn('removePolicyTemplates share', e.message);
      }),
  ]);
}

/**
 * Insert test oauth2 authorization code.
 * @function insertTestAuthorizationCode
 * @returns {undefined}
 */
export function insertTestAuthorizationCode() {
  return OAuth2AuthorizationCodeRepository.create(testOauth2AUthorizationCode, { method: 'insert' });
}

/**
 * Remove test oauth2 authorization code.
 * @function removeTestAuthorizationCode
 * @returns {undefined}
 */
export function removeTestAuthorizationCode() {
  return OAuth2AuthorizationCodeRepository.deleteById(testOauth2AUthorizationCode.id)
    .catch(e => {
      logger.warn('removeTestAuthorizationCode', e.message);
    });
}

/**
 * Insert fake3p service provider.
 * @function insertFake3pServiceProvider
 * @returns {undefined}
 */
export function insertFake3pServiceProvider() {
  return fs.readFile('api/testdata/fake3p-logo.png')
    .then(imgData =>
      ServiceProviderRepository.create({
        ...fake3pServiceProvider,
        logo: imgData,
      }, { method: 'insert' })
    );
}

/**
 * Remove test Fake 3P service provider.
 * @function removeFake3pServiceProvider
 * @returns {undefined}
 */
export function removeFake3pServiceProvider() {
  return ServiceProviderRepository.deleteById(fake3pServiceProvider.id)
    .catch(e => {
      logger.warn('removeFake3pServiceProvider', e.message);
    });
}

/**
 * Insert location place.
 * @function insertLocationPlace
 * @returns {undefined}
 */
export function insertLocationPlace() {
  return PlaceRepository.create(locationPlace, { method: 'insert' });
}

/**
 * Remove location place.
 * @function removeLocationPlace
 * @returns {undefined}
 */
export function removeLocationPlace() {
  return PlaceRepository.deleteById(locationPlace.id)
    .catch(e => {
      logger.warn('removeLocationPlace', e.message);
    });
}

/**
 * Insert location user.
 * @function insertLocationUser
 * @returns {undefined}
 */
export function insertLocationUser() {
  return UserPlaceRoleRepository.create(locationUser, { method: 'insert' });
}

/**
 * Remove location user.
 * @function removeLocationUser
 * @returns {undefined}
 */
export function removeLocationUser() {
  return UserPlaceRoleRepository.deleteById(locationUser.id)
    .catch(e => {
      logger.warn('removeLocationUser', e.message);
    });
}

/**
 * Insert location policy.
 * @function insertLocationPolicy
 * @returns {undefined}
 */
export function insertLocationPolicy() {
  logger.info('insert locationPolicy', locationPolicy);
  return PolicyRepository.create(locationPolicy, { method: 'insert' })
    .catch(e => {
      logger.warn('insertLocationPolicy', e.message);
    });
}

/**
 * Remove location policy.
 * @function removeLocationPolicy
 * @returns {undefined}
 */
export function removeLocationPolicy() {
  logger.info('remove locationPolicy', locationPolicy);
  return PolicyRepository.deleteById(locationPolicy.id)
    .catch(e => {
      logger.warn('removeLocationPolicy', e.message);
    });
}

/**
 * Insert location authorization accessToken.
 * @function insertLocationToken
 * @returns {undefined}
 */
export function insertLocationToken() {
  return OAuth2AccessTokenRepository.create(locationAccessToken, { method: 'insert' });
}

/**
 * Remove location authorization accessToken.
 * @function removeLocationToken
 * @returns {undefined}
 */
export function removeLocationToken() {
  return OAuth2AccessTokenRepository.deleteById(locationAccessToken.id)
    .catch(e => {
      logger.warn({ e }, 'removeLocationToken');
    });
}

/**
 * Remove test data
 * @function removeTestData
 * @returns {undefined}
 */
export function removeTestData() {
  logger.info('removeTestData');
  return BPromise.resolve()
    .then(removeLocationToken)
    .then(removeTestAuthorizationCode)
    .then(removeLocationToken)
    .then(removeLocationUser)
    .then(removeLocationPolicy)
    .then(removeLocationPlace)
    .then(removePolicyTemplates)
    .then(removeFake3pServiceProvider)
    .then(removeTestClient)
    .catch(err => { logger.warn(err); throw err; })
    ;
}

/**
 * Insert test data.
 * @function insertTestData
 * @returns {undefined}
 */
export function insertTestData() {
  logger.info('insertTestData');
  return removeTestData()
    .then(insertTestClient)
    .then(insertFake3pServiceProvider)
    .then(insertPolicyTemplates)
    .then(insertLocationPlace)
    .then(insertLocationPolicy)
    .then(insertLocationUser)
    .then(insertLocationToken)
    .then(insertTestAuthorizationCode);
}

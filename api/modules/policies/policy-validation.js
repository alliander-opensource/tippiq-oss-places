/**
 * Policy validation.
 * @module policies/policy-validation
 */

import BPromise from 'bluebird';
import _ from 'lodash';

import { ValidationError } from '../../common/errors';
import { validateRequiredField, validateUuidField } from '../../common/validation-utils';
import { PolicyTemplateRepository } from '../policy-templates/repositories';

/**
 * Validate template slug
 * @function validateTemplateSlug
 * @param {Object} policy Policy to be validated.
 * @returns {undefined}
 */
function validateTemplateSlug(policy) {
  return BPromise
    .resolve(policy.templateSlug)
    .tap((templateSlug) => {
      if (!templateSlug) { // slug must be set for now
        throw new ValidationError('Invalid value for templateSlug.');
      }
    })
    .tap(templateSlug =>
      PolicyTemplateRepository
        .findOne({ slug: templateSlug, service_provider_id: policy.serviceProviderId })
        .catch(() => {
          throw new ValidationError('Invalid value for templateSlug.');
        })
    );
}

/**
 * Validate if submitted policy values matches its template
 * @function validateTemplate
 * @param {Object} policy Policy to be validated.
 * @returns {undefined}
 */
function validateTemplate(policy) {
  const excludeFields = ['id', 'slug', 'created_at', 'updated_at'];
  return PolicyTemplateRepository
    .findOne({ slug: policy.templateSlug, service_provider_id: policy.serviceProviderId })
    .tap(policyTemplate =>
      _.forOwn(_.omit(policyTemplate.serialize({ context: 'policy-template' }), excludeFields),
        (item, key) => {
          if (item && policy[key] !== item) {
            throw new ValidationError(`Invalid value for ${key}.`);
          }
        })
    );
}

/**
 * Validate policy.
 * @function validatePolicy
 * @param {Object} policy Policy to be validated.
 * @returns {undefined}
 */
export default function validatePolicy(policy) {
  return BPromise.resolve(policy)
    .tap(validateRequiredField('placeId'))
    .tap(validateRequiredField('userId'))
    .tap(validateRequiredField('serviceProviderId'))
    .tap(validateUuidField('placeId'))
    .tap(validateUuidField('userId'))
    .tap(validateUuidField('serviceProviderId'))
    .tap(validateTemplateSlug)
    .tap(validateTemplate);
}

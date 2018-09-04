/**
 * Response handler for policies/get-all-policy-templates.
 * @module modules/policy-templates/actions/get-all-policy-templates
 */

import { PolicyTemplateRepository } from '../repositories';
import SearchFilter, { TYPE_MATCH_ONE, TYPE_EXACT_MATCH } from '../../search-filter';
import { GET_ALL_POLICY_TEMPLATES } from '../../auth/permissions';
import { validatePermissions } from '../../auth/auth';

/**
 * Response handler for getting filtered policy templates.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  const searchFilters = [];
  const { serviceProviderId, slugs } = req.query;

  if (serviceProviderId) {
    searchFilters
      .push(new SearchFilter('service_provider_id', serviceProviderId, TYPE_EXACT_MATCH));
  }

  if (slugs) {
    searchFilters
      .push(new SearchFilter('slug', slugs, TYPE_MATCH_ONE));
  }

  validatePermissions(req, res, GET_ALL_POLICY_TEMPLATES)
    .then(() => PolicyTemplateRepository.findAllWithFilters(searchFilters))
    .then(policies => res.json(policies.serialize({ context: 'policy-template' })));
}

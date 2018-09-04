/**
 * PolicyTemplateRepository.
 * @module modules/policy-templates/repositories/policy-template-repository
 */
import debugLogger from 'debugnyan';

import { PolicyTemplate } from '../models';
import BaseRepository from '../../../common/base-repository';
import { METHOD_WHERE, METHOD_WHERE_IN } from '../../search-filter';

const debug = debugLogger('tippiq-places:policy-templates:policy-template-repository');

/**
 * Apply search filters
 * @function applyFilters
 * @param {Object} qb The Knex query builder
 * @param {Array.<String>} filters The search filters to apply
 * @returns {undefined}
 */
function applyFilters(qb, filters) {
  filters.forEach((filter) => {
    switch (filter.method) {
      case METHOD_WHERE:
        qb.where(filter.column, filter.operator, filter.value);
        break;

      case METHOD_WHERE_IN:
        qb.whereIn(filter.column, filter.value);
        break;

      default:
        debug.warn(`Unknown search filter method, '${filter.method}'.`);
    }
  });
}

/**
 * A Repository for PolicyTemplate.
 * @class PolicyTemplateRepository
 * @extends BaseRepository
 */
export class PolicyTemplateRepository extends BaseRepository {
  /**
   * Construct a PolicyTemplateRepository for PolicyTemplate.
   * @constructs PolicyTemplateRepository
   */
  constructor() {
    super(PolicyTemplate);
  }

  /**
   * Find all policies with filters applied.
   * @function findAllWithFilters
   * @param {Array.<Object>} searchFilters Search filters to apply
   * @returns {Promise<Collection>} A Promise that resolves to a Collection of policy templates.
   */
  findAllWithFilters(searchFilters) {
    let dbFilters = [];

    searchFilters.forEach((searchFilter) => {
      dbFilters = dbFilters.concat(searchFilter.getQuery());
    });

    return PolicyTemplate
      .query(qb => applyFilters(qb, dbFilters))
      .fetchAll();
  }
}

export default new PolicyTemplateRepository();

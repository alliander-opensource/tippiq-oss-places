/**
 * PolicyRepository.
 * @module modules/policies/repositories/policy-repository
 */

import { Policy } from '../models';
import BaseRepository from '../../../common/base-repository';

/**
 * A Repository for policies.
 * @class PolicyRepository
 * @extends BaseRepository
 */
export class PolicyRepository extends BaseRepository {
  /**
   * Construct a PolicyRepository for Policy.
   * @constructs PolicyRepository
   */
  constructor() {
    super(Policy);
  }
}

export default new PolicyRepository();

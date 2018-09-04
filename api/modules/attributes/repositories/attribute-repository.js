/**
 * AttributeRepository.
 * @module modules/attributes/repositories/attribute-repository
 */

import { Attribute } from '../models';
import BaseRepository from '../../../common/base-repository';

/**
 * A Repository for attributes.
 * @class AttributeRepository
 * @extends BaseRepository
 */
export class AttributeRepository extends BaseRepository {
  /**
   * Construct a AttributeRepository for Attribute.
   * @constructs AttributeRepository
   */
  constructor() {
    super(Attribute);
  }
}

export default new AttributeRepository();

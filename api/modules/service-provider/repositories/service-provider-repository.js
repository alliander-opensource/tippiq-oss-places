/**
 * ServiceProviderRepository.
 * @module modules/service-provider/service-provider-repository
 */
import { ServiceProvider } from '../models';
import BaseRepository from '../../../common/base-repository';
import { knex } from '../../../common/bookshelf';

/**
 * A Repository for ServiceProvider.
 * @class ServiceProviderRepository
 * @extends BaseRepository
 */
export class ServiceProviderRepository extends BaseRepository {
  /**
   * Construct a ServiceProviderRepository for ServiceProvider.
   * @constructs ServiceProviderRepository
   */
  constructor() {
    super(ServiceProvider);
  }

  /**
   * Find services by place id
   * @function findByPlaceId
   * @param {string} placeId Place id
   * @return {*|Promise.<Collection>}
   */
  findByPlaceId(placeId) {
    return this.Model
      .query(qb => qb
        .whereIn('id',
          knex.select('service_provider_id').from('policy').where({ place_id: placeId }))
      ).fetchAll();
  }

  /**
   * Find services except by place id
   * @function findExceptByPlaceId
   * @param {string} placeId Place id
   * @return {*|Promise.<Collection>}
   */
  findExceptByPlaceId(placeId) {
    return this.Model
      .query(qb => qb
        .whereNotIn('id',
          knex.select('service_provider_id').from('policy').where({ place_id: placeId })
        )
        .orderByRaw("content->>'inDevelopment' desc, name desc")
      ).fetchAll();
  }
}

export default new ServiceProviderRepository();

/**
 * UserPlaceRoleRepository.
 * @module modules/user-place-roles/repositories/user-place-role-repository
 */

import { UserPlaceRole } from '../models';
import BaseRepository from '../../../common/base-repository';

/**
 * A Repository for user place roles.
 * @class UserPlaceRoleRepository
 * @extends BaseRepository
 */
export class UserPlaceRoleRepository extends BaseRepository {
  /**
   * Construct a UserPlaceRoleRepository.
   * @constructs UserPlaceRoleRepository
   */
  constructor() {
    super(UserPlaceRole);
  }

  /**
   * Find all user place role records by place id.
   * @function findByPlaceId
   * @param {string} placeId PlaceId to find user place role records for
   * @returns {Promise<Collection>} A Promise that resolves to a Collection of UserPlaceRoles.
   */
  findByPlaceId(placeId) {
    return this.findAll({ place_id: placeId });
  }

  /**
   * Find user place role records with certain place.
   * @function getUserPlaceRoleWithPlace
   * @param {string} tippiqId Tippiq_id user id
   * @param {string} placeId Place id to get user place role record for
   * @returns {Promise<Model>} A Promise that resolves to a Model of UserPlaceRoles.
   */
  getUserPlaceRoleByTippiqUserIdAndPlace(tippiqId, placeId) {
    return this.findOne({ tippiq_id: tippiqId, place_id: placeId });
  }
}

export default new UserPlaceRoleRepository();

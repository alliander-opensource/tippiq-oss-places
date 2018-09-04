/**
 * UserRoleRepository.
 * @module modules/auth/user-role-repository
 */
import UserRoleModel from './user-role-model';
import BaseRepository from '../../common/base-repository';

/**
 * A Repository for UserRole.
 * @class UserRoleRepository
 * @extends BaseRepository
 */
export default class UserRoleRepository extends BaseRepository {
  /**
   * Construct a UserRoleRepository for UserRole.
   * @constructs UserRoleRepository
   */
  constructor() {
    super(UserRoleModel);
  }

  /**
   * Find all roles by user.
   * @function findRolesByUser
   * @param {string} user User to find roles for
   * @returns {Promise<Collection>} A Promise that resolves to a Collection of roles.
   */
  findRolesByUser(user) {
    return this.findAll({ user });
  }
}

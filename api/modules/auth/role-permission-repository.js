/**
 * RolePermissionRepository.
 * @module modules/auth/role-permission-repository
 */
import RolePermissionModel from './role-permission-model';
import BaseRepository from '../../common/base-repository';

/**
 * A Repository for RolePermission.
 * @class RolePermissionRepository
 * @extends BaseRepository
 */
export default class RolePermissionRepository extends BaseRepository {
  /**
   * Construct a RolePermissionRepository for RolePermission.
   * @constructs RolePermissionRepository
   */
  constructor() {
    super(RolePermissionModel);
  }

  /**
   * Find all roles by permission.
   * @function findRolesByPermission
   * @param {string} permission Permission to find roles for
   * @returns {Promise<Collection>} A Promise that resolves to a Collection of roles.
   */
  findRolesByPermission(permission) {
    return this.findAll({ permission });
  }
}

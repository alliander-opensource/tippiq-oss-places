/**
 * RolePermissionModel.
 * @module auth/role-permission-model
 */

import BaseModel from '../../common/base-model';
import RoleModel from './role-model';
import PermissionModel from './permission-model';

const instanceProps = {
  tableName: 'role_permission',
  role: () => this.belongsTo(RoleModel, 'role'),
  permission: () => this.belongsTo(PermissionModel, 'permission'),
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);

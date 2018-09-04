/**
 * UserRoleModel.
 * @module modules/auth/user-role-model
 */

import BaseModel from '../../common/base-model';

const instanceProps = {
  tableName: 'user_role',
};

const classProps = {};

export default BaseModel.extend(instanceProps, classProps);

/**
 * RoleCollection.
 * @module modules/auth/role-collection
 */

import bookshelf from '../../common/bookshelf';
import RoleModel from './role-model';

const instanceProps = {
  model: RoleModel,
};

const classProps = {};

export default bookshelf.Collection.extend(instanceProps, classProps);

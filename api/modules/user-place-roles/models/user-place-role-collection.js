/**
 * UserPlaceRoleCollection.
 * @module modules/user-place-roles/user-place-role-collection
 */

import bookshelf from '../../../common/bookshelf';
import { UserPlaceRole } from './index';

const instanceProps = {
  model: UserPlaceRole,
};

const classProps = {};

export default bookshelf.Collection.extend(instanceProps, classProps);

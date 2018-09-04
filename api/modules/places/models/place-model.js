/**
 * Place model.
 * @module modules/places/models/place
 */

import _ from 'lodash';
import debugLogger from 'debugnyan';

import BaseModel from '../../../common/base-model';
import { UserPlaceRole } from '../../user-place-roles/models';
import { Attribute } from '../../attributes/models';
import { Policy } from '../../policies/models';

const debug = debugLogger('tippiq-places:places:models:place');

const instanceProps = {
  tableName: 'place',
  attributes() {
    return this.hasMany(Attribute, 'place_id');
  },
  policies() {
    return this.hasMany(Policy, 'place_id');
  },
  userPlaceRoles() {
    return this.hasMany(UserPlaceRole, 'place_id');
  },
  serialize(options) {
    const mergedOptions = options || {};
    switch (mergedOptions.context) {
      case 'place':
        return _.chain(BaseModel.prototype.serialize.apply(this, [mergedOptions]))
          .pick([
            'id',
            'private_key',
            'public_key',
          ])
          .value();
      default:
        debug.warn('unknown serialization context \'%s\'', mergedOptions.context);
        return {};
    }
  },
};

const classProps = { dependents: ['userPlaceRoles', 'attributes', 'policies'] };

export default BaseModel.extend(instanceProps, classProps);

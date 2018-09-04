/**
 * UserPlaceRole model.
 * @module modules/user-place-roles/models/user-place-role
 */

import _ from 'lodash';
import debugLogger from 'debugnyan';

import BaseModel from '../../../common/base-model';
import { Place } from '../../places/models';
import { OAuth2AccessToken, OAuth2AuthorizationCode } from '../../oauth2/models';

const debug = debugLogger('tippiq-places:user-place-roles:models:user-place-role');

const instanceProps = {
  tableName: 'user_place_role',
  place() {
    return this.belongsTo(Place, 'place_id');
  },
  accessTokens() {
    return this.hasMany(OAuth2AccessToken, 'user_id');
  },
  authorizationCodes() {
    return this.hasMany(OAuth2AuthorizationCode, 'user_id');
  },
  serialize(options) {
    const mergedOptions = options || {};
    switch (mergedOptions.context) {
      case 'place:user-place-role':
        return _.chain(BaseModel.prototype.serialize.apply(this, [mergedOptions]))
          .pick([
            'id',
            'tippiqId',
            'role',
          ])
          .value();
      default:
        debug.warn('unknown serialization context \'%s\'', mergedOptions.context);
        return {};
    }
  },
};

const classProps = { dependents: ['accessTokens', 'authorizationCodes'] };

export default BaseModel.extend(instanceProps, classProps);

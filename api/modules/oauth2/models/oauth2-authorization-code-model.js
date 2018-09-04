/**
 * OAuth2AuthorizationCode model.
 * @module modules/oauth2/models/oauth2-authorization-code
 */

import debugLogger from 'debugnyan';
import _ from 'lodash';

import BaseModel from '../../../common/base-model';

const debug = debugLogger('tippiq-places:oauth2:models:oauth2-authorization-code');

const instanceProps = {
  tableName: 'oauth2_authorization_code',
  serialize(options) {
    const mergedOptions = options || {};
    switch (mergedOptions.context) {
      case 'oauth2-code':
        return _
          .chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick([
            'clientId',
            'userId',
            'createdAt',
          ])
          .value();
      default:
        debug.warn('unknown serialization context \'%s\'', mergedOptions.context);
        return {};
    }
  },
};

const classProps = {};

const OAuth2AuthorizationCode = BaseModel.extend(instanceProps, classProps);

export default OAuth2AuthorizationCode;

/**
 * OAuth2Client model.
 * @module modules/oauth2/models/access-client-model
 */

import debugLogger from 'debugnyan';
import _ from 'lodash';

import BaseModel from '../../../common/base-model';

const debug = debugLogger('tippiq-places:oauth2:models:oauth2-client');

const instanceProps = {
  tableName: 'oauth2_client',
  serialize(options) {
    const mergedOptions = options || {};
    switch (mergedOptions.context) {
      case 'oauth2-client':
        return _
          .chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick(['clientId'])
          .value();
      default:
        debug.warn('unknown serialization context \'%s\'', mergedOptions.context);
        return {};

    }
  },
};

const classProps = {};

const OAuth2Client = BaseModel.extend(instanceProps, classProps);

export default OAuth2Client;

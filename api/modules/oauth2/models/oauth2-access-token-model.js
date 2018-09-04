/**
 * OAuth2AccessToken model.
 * @module modules/oauth2/models/oauth2-access-token
 */

import debugLogger from 'debugnyan';

import BaseModel from '../../../common/base-model';

const debug = debugLogger('tippiq-places:oauth2:models:oauth2-access-token');

const instanceProps = {
  tableName: 'oauth2_access_token',
  serialize(options) {
    const mergedOptions = options || {};
    switch (mergedOptions.context) {
      default:
        debug.warn('unknown serialization context \'%s\'', mergedOptions.context);
        return {};
    }
  },
};

const classProps = {};

const OAuth2AccessToken = BaseModel.extend(instanceProps, classProps);

export default OAuth2AccessToken;

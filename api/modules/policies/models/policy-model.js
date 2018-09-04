/**
 * Policy model.
 * @module modules/policies/models/policy
 */

import _ from 'lodash';
import debugLogger from 'debugnyan';

import BaseModel from '../../../common/base-model';

const debug = debugLogger('tippiq-places:policies:models:policy');

const instanceProps = {
  tableName: 'policy',
  serialize(options) {
    const mergedOptions = options || {};
    switch (mergedOptions.context) {
      case 'policy':
        return _.chain(BaseModel.prototype.serialize.apply(this, [mergedOptions]))
          .pick([
            'id',
            'templateSlug',
            'actorLabel',
            'actionLabel',
            'acteeLabel',
            'conditions',
            'title',
            'description',
            'serviceProviderId',
            'critical',
            'criticalDisableWarning',
            'userId',
            'signature',
            'placeId',
          ])
          .value();
      default:
        debug.warn('unknown serialization context \'%s\'', mergedOptions.context);
        return {};
    }
  },
};

const classProps = {};

const Policy = BaseModel.extend(instanceProps, classProps);

export default Policy;

/**
 * PolicyTemplate model.
 * @module modules/policy-templates/models/policy-template
 */

import _ from 'lodash';
import debugLogger from 'debugnyan';

import BaseModel from '../../../common/base-model';

const debug = debugLogger('tippiq-places:policy-templates:models:policy-template');

const instanceProps = {
  tableName: 'policy_template',
  serialize(options) {
    const mergedOptions = options || {};
    switch (mergedOptions.context) {
      case 'policy-template':
        return _.chain(BaseModel.prototype.serialize.apply(this, [mergedOptions]))
          .pick([
            'id',
            'slug',
            'actorLabel',
            'actionLabel',
            'acteeLabel',
            'conditions',
            'title',
            'description',
            'serviceProviderId',
            'critical',
            'criticalDisableWarning',
          ])
          .value();
      default:
        debug.warn('unknown serialization context \'%s\'', mergedOptions.context);
        return {};
    }
  },
};

const classProps = {};

const PolicyTemplate = BaseModel.extend(instanceProps, classProps);

export default PolicyTemplate;

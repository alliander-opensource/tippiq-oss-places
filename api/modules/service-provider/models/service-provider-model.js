/**
 * ServiceProvider Model.
 * @module modules/service-provider/service-provider-model
 */

import _ from 'lodash';
import debugLogger from 'debugnyan';

import BaseModel from '../../../common/base-model';
import { Policy } from '../../policies/models';
import { PolicyTemplate } from '../../policy-templates/models';

const debug = debugLogger('tippiq-places:service-provider:model');

const instanceProps = {
  tableName: 'service_provider',
  policies() {
    return this.hasMany(Policy, 'service_provider_id');
  },
  policyTemplates() {
    return this.hasMany(PolicyTemplate, 'service_provider_id');
  },
  serialize(options) {
    const mergedOptions = options || {};
    switch (mergedOptions.context) {
      case 'service-provider-resources':
        return _.chain(BaseModel.prototype.serialize.apply(this, [mergedOptions]))
          .pick([
            'id',
            'name',
            'brandColor',
            'logo',
            'content',
          ])
          .transform((that, value, key) =>
            _.set(that, key, key === 'logo' && value ? value.toString('base64') : value))
          .value();
      default:
        debug.warn('unknown serialization context \'%s\'', mergedOptions.context);
        return {};
    }
  },
};

const classProps = { dependents: ['policies', 'policyTemplates'] };

const ServiceProvider = BaseModel.extend(instanceProps, classProps);

export default ServiceProvider;


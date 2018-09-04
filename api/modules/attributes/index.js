/**
 * Point of contact for attributes module.
 * @module modules/attributes
 * @example import { routes } from './attributes';
 */

import routes from './attribute-routes';

export { Attribute } from './models';
export { AttributeRepository } from './repositories';

export default {
  routes,
};

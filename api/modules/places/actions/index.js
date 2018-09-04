/**
 * Point of contact for place actions.
 * @module modules/places
 * @example import { getPlace } from './actions';
 */

import addPlace from './add-place';
import getPlace from './get-place';
import deletePlace from './delete-place';
import getServices from './get-services';
import getServicesExceptActive from './get-services-except-active';

export {
  addPlace,
  getPlace,
  deletePlace,
  getServices,
  getServicesExceptActive,
};

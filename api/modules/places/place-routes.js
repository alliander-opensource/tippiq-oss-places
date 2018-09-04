/**
 * Express Router for place actions.
 * @module places/place-routes
 */

import { Router as expressRouter } from 'express';

import { getPlace, addPlace, deletePlace, getServices, getServicesExceptActive } from './actions';

const router = expressRouter();
export { router as default };

router.route('/')
  .post(addPlace);

router.route('/:id/services')
  .get(getServices);

router.route('/:id/services-except-active')
  .get(getServicesExceptActive);

router.route('/:id')
  .get(getPlace)
  .delete(deletePlace);

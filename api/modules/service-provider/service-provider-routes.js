/**
 * Express Router for serviceProvider actions.
 * @module service-provider/service-provider-routes
 */
import { Router as expressRouter } from 'express';

import getServiceProvider from './actions/get-service-provider';
import getServiceProviders from './actions/get-service-providers';

const router = expressRouter();
export { router as default };

router.route('/')
  .get(getServiceProviders);

router.route('/:id')
  .get(getServiceProvider);

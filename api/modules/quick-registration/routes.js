/**
 * Express Router for quick registration actions.
 * @module quick-registration/routes
 */

import { Router as expressRouter } from 'express';

import { quickRegistration } from './actions';

const router = expressRouter({ mergeParams: true });
export default router;

router.route('/')
  .post(quickRegistration);

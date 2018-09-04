/**
 * Express Router for policy actions.
 * @module policies/policy-routes
 */

import { Router as expressRouter } from 'express';

import { getAllPolicies, addPolicy, getPolicy, updatePolicy, deletePolicy } from './actions';

const router = expressRouter({ mergeParams: true });
export { router as default };

router.route('/')
  .get(getAllPolicies)
  .post(addPolicy);

router.route('/:id')
  .get(getPolicy)
  .put(updatePolicy)
  .delete(deletePolicy);

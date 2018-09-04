/**
 * Express Router for policy template actions.
 * @module policy-templates/policy-template-routes
 */

import { Router as expressRouter } from 'express';

import { getAllPolicyTemplates } from './actions';

const router = expressRouter();
export { router as default };

router.route('/')
  .get(getAllPolicyTemplates);

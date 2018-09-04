/**
 * Express Router for messages actions.
 * @module messages/messages-routes
 */

import { Router as expressRouter } from 'express';

import { sendRenderedEmail } from './actions';

const router = expressRouter({ mergeParams: true });
export default router;

router.route('/rendered-email')
  .post(sendRenderedEmail);

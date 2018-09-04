/**
 * Express Router for user actions.
 * @module modules/oauth2/oauth2-routes
 */

import { Router as expressRouter } from 'express';

import { authorization, decision, token } from './oauth2';
import { getProfile, verifyRedirectUri } from './actions';

const router = expressRouter();

export { router as default };

router
  .get('/authorization', authorization)
  .get('/verify-redirect-uri', verifyRedirectUri)
  .get('/profile/:clientId/:userId', getProfile)
  .post('/authorization/decision', decision)
  .post('/token', token);

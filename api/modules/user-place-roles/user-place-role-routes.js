/**
 * Express Router for user place role actions.
 * @module user-place-roles/user-place-role-routes
 */

import { Router as expressRouter } from 'express';

import {
  getUserPlaceRoles,
  getDisplayName,
} from './actions';

const router = expressRouter({ mergeParams: true });
export default router;

router.route('/')
  .get(getUserPlaceRoles);

router.route('/:userId/display-name')
  .get(getDisplayName);

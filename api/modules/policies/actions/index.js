/**
 * Point of contact for policy actions.
 * @module modules/policies
 * @example import { addPolicy, getPolicy } from './actions';
 */

import getAllPolicies from './get-all-policies';
import addPolicy from './add-policy';
import getPolicy from './get-policy';
import updatePolicy from './update-policy';
import deletePolicy from './delete-policy';

export {
  getAllPolicies,
  addPolicy,
  getPolicy,
  updatePolicy,
  deletePolicy,
};

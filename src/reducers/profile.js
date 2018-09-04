/**
 * Profile reducer.
 * @module reducers/profile
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import {
  PROFILE_LOAD,
  USER_LOGOUT,
} from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  scrambledEmail: null,
};

/**
 * Profile reducer.
 * @function profile
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function profile(state = initialState, action = {}) {
  switch (action.type) {
    case `${PROFILE_LOAD}_PENDING`:
      return {
        ...state,
        status: PENDING,
        scrambledEmail: null,
      };
    case `${PROFILE_LOAD}_SUCCESS`:
      return {
        ...state,
        status: SUCCESS,
        scrambledEmail: action.result.scrambledEmail,
      };
    case `${PROFILE_LOAD}_FAIL`:
      return {
        ...state,
        status: FAIL,
        scrambledEmail: null,
      };
    case USER_LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

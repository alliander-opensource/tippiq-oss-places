/**
 * DisplayName reducer.
 * @module reducers/displayName
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import {
  DISPLAY_NAME_LOAD,
  USER_LOGOUT,
} from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  displayName: null,
};

/**
 * DisplayName reducer.
 * @function displayName
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function displayName(state = initialState, action = {}) {
  switch (action.type) {
    case `${DISPLAY_NAME_LOAD}_PENDING`:
      return {
        ...state,
        status: PENDING,
      };
    case `${DISPLAY_NAME_LOAD}_SUCCESS`:
      return {
        ...state,
        status: SUCCESS,
        displayName: action.result.displayName,
      };
    case `${DISPLAY_NAME_LOAD}_FAIL`:
      return {
        ...state,
        status: FAIL,
      };
    case USER_LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

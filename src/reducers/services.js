/**
 * residents reducer.
 * @module reducers/residents
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';

import {
  SERVICES_LOAD,
} from '../constants/ActionTypes';

const initialState = {
  list: null,
  status: IDLE,
  error: false,
};

/**
 * Residents reducer.
 * @function residents
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default
function services(state = initialState, action = {}) {
  switch (action.type) {
    case `${SERVICES_LOAD}_PENDING`:
      return {
        ...state,
        status: PENDING,
        error: null,
        list: null,
      };
    case `${SERVICES_LOAD}_SUCCESS`:
      return {
        ...state,
        status: SUCCESS,
        error: null,
        list: action.result,
      };
    case `${SERVICES_LOAD}_FAIL`:
      return {
        ...state,
        status: FAIL,
        error: action.error,
      };
    default:
      return state;
  }
}

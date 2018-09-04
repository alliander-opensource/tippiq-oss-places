/**
 * residents reducer.
 * @module reducers/residents
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';

import {
  ALL_SERVICES_LOAD,
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
function allServices(state = initialState, action = {}) {
  switch (action.type) {
    case `${ALL_SERVICES_LOAD}_PENDING`:
      return {
        ...state,
        status: PENDING,
        error: null,
        list: null,
      };
    case `${ALL_SERVICES_LOAD}_SUCCESS`:
      return {
        ...state,
        status: SUCCESS,
        error: null,
        list: action.result,
      };
    case `${ALL_SERVICES_LOAD}_FAIL`:
      return {
        ...state,
        status: FAIL,
        error: action.error,
      };
    default:
      return state;
  }
}

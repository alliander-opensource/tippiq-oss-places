/**
 * Consent reducer.
 * @module reducers/consent
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import { CONSENT } from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  authorizationCode: null,
  error: null,
};

/**
 * Consent reducer.
 * @function consent
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function consent(state = initialState, action = {}) {
  switch (action.type) {
    case `${CONSENT}_PENDING`:
      return {
        ...state,
        status: PENDING,
        authorizationCode: null,
        error: null,
      };
    case `${CONSENT}_SUCCESS`:
      return {
        ...state,
        status: SUCCESS,
        authorizationCode: action.result.code,
      };
    case `${CONSENT}_FAIL`:
      return {
        ...state,
        status: FAIL,
        error: action.error,
      };
    default:
      return state;
  }
}

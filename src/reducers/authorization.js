/**
 * Authorization reducer.
 * @module reducers/authorization
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import { AUTHORIZE } from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  clientName: null,
  transactionId: null,
  error: null,
};

/**
 * Authorization reducer.
 * @function authorization
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function authorization(state = initialState, action = {}) {
  switch (action.type) {
    case `${AUTHORIZE}_PENDING`:
      return {
        ...state,
        status: PENDING,
        clientName: null,
        transactionId: null,
        error: null,
      };
    case `${AUTHORIZE}_SUCCESS`:
      return {
        ...state,
        status: SUCCESS,
        clientName: action.result.client.clientId,
        transactionId: action.result.transactionId,
        error: null,
      };
    case `${AUTHORIZE}_FAIL`:
      return {
        ...state,
        status: FAIL,
        clientName: null,
        transactionId: null,
        error: action.error,
      };
    default:
      return state;
  }
}

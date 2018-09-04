/**
 * Add place reducer.
 * @module reducers/addPlace
 */

import jwtDecode from 'jwt-decode';

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import { PLACE_ADD } from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  result: null,
  error: null,
};

/**
 * Places reducer.
 * @function places
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function places(state = initialState, action = {}) {
  switch (action.type) {
    case `${PLACE_ADD}_PENDING`:
      return {
        ...state,
        status: PENDING,
        result: null,
        error: null,
      };
    case `${PLACE_ADD}_SUCCESS`:
      return {
        ...state,
        status: SUCCESS,
        result: {
          token: action.result.placeToken,
          placeId: jwtDecode(action.result.placeToken).placeId,
        },
        error: null,
      };
    case `${PLACE_ADD}_FAIL`:
      return {
        ...state,
        status: FAIL,
        result: null,
        error: null,
      };
    default:
      return state;
  }
}

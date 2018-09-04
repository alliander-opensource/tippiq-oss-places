/**
 * Place location reducer.
 * @module reducers/placeLocation
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';

import {
  LOCATION_LOAD,
  USER_LOGOUT,
} from '../constants/ActionTypes';

const initialState = {
  result: null,
  placeId: null,
  status: IDLE,
  error: false,
};

const actionsMap = {
  [`${LOCATION_LOAD}_PENDING`]: state => ({
    ...state,
    status: PENDING,
    error: null,
    placeId: null,
    result: null,
  }),
  [`${LOCATION_LOAD}_SUCCESS`]: (state, action) => {
    if (action.result.length === 1) {
      return {
        ...state,
        status: SUCCESS,
        error: null,
        placeId: action.result[0].placeId,
        result: action.result[0].data,
      };
    }
    return {
      ...state,
      status: FAIL,
      error: { message: `Expected length of 1, received ${action.result.length}` },
      placeId: null,
      result: null,
    };
  },
  [`${LOCATION_LOAD}_FAIL`]: (state, action) => ({
    ...state,
    status: FAIL,
    error: action.error,
  }),
  [USER_LOGOUT]: () => ({
    ...initialState,
  }),
};

/**
 *Place location reducer.
 * @function
 * @param {Object} state initialstate.
 * @param {Object} action result.
 * @returns {Promise} Action promise.
 */
export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) {
    return state;
  }

  return { ...state, ...reduceFn(state, action) };
}

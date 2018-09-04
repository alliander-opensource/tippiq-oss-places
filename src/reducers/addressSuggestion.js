/**
 * AddressSuggestion reducer.
 * @module reducers/addressSuggestion
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';

import {
  ADDRESS_SUGGESTION_UPDATE,
  ADDRESS_SUGGESTIONS_LOAD,
  ADDRESS_SUGGESTIONS_RESET,
} from '../constants/ActionTypes';

const initialState = {
  status: IDLE,
  error: false,
  selected: null,
  query: '',
  items: [],
};

const actionsMap = {
  [`${ADDRESS_SUGGESTIONS_LOAD}_PENDING`]: state => ({
    ...state,
    status: PENDING,
    error: false,
  }),
  [`${ADDRESS_SUGGESTIONS_LOAD}_SUCCESS`]: (state, action) => ({
    ...state,
    items: action.result,
    status: SUCCESS,
    error: false,
  }),
  [`${ADDRESS_SUGGESTIONS_LOAD}_FAIL`]: state => ({
    ...state,
    status: FAIL,
    error: true,
  }),
  [ADDRESS_SUGGESTION_UPDATE]: (state, action) => ({
    ...state,
    query: action.query,
    selected: action.selected,
  }),
  [`${ADDRESS_SUGGESTIONS_RESET}`]: state => ({
    ...state,
    items: [],
  }),
};

/**
 * AddressSuggestion reducer
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

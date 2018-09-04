/**
 * policies reducer.
 * @module reducers/policies
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import {
  TEMPLATES_LOAD,
  POLICIES_LOAD,
  POLICIES_SAVE,
} from '../constants/ActionTypes';

const initialState = {
  list: null,
  templates: {
    status: IDLE,
    error: false,
    list: null,
  },
  load: {
    status: IDLE,
    error: false,
  },
  save: {
    status: IDLE,
    error: false,
  },
};

const actionsMap = {
  [`${TEMPLATES_LOAD}_PENDING`]: state => ({
    ...state,
    templates: {
      status: PENDING,
      error: null,
      list: null,
    },
  }),
  [`${TEMPLATES_LOAD}_SUCCESS`]: (state, action) => ({
    ...state,
    templates: {
      status: SUCCESS,
      list: action.result,
    },
  }),
  [`${TEMPLATES_LOAD}_FAIL`]: (state, action) => ({
    ...state,
    templates: {
      status: FAIL,
      error: action.error,
    },
  }),
  [`${POLICIES_LOAD}_PENDING`]: state => ({
    ...state,
    load: {
      status: PENDING,
      error: null,
    },
    list: null,
  }),
  [`${POLICIES_LOAD}_SUCCESS`]: (state, action) => ({
    ...state,
    load: {
      status: SUCCESS,
    },
    list: action.result,
  }),
  [`${POLICIES_LOAD}_FAIL`]: (state, action) => ({
    ...state,
    load: {
      status: FAIL,
      error: action.error,
    },
  }),
  [`${POLICIES_SAVE}_PENDING`]: state => ({
    ...state,
    save: {
      status: PENDING,
      error: null,
      success: false,
    },
  }),
  [`${POLICIES_SAVE}_SUCCESS`]: state => ({
    ...state,
    save: {
      status: SUCCESS,
      success: true,
    },
  }),
  [`${POLICIES_SAVE}_FAIL`]: (state, action) => ({
    ...state,
    save: {
      status: FAIL,
      error: action.error,
    },
  }),
};


/**
 * Policies reducer.
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

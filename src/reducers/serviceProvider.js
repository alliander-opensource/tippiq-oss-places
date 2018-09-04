/**
 * Service provider reducer.
 * @module reducers/serviceProvider
 */

import { IDLE, PENDING, SUCCESS, FAIL } from '../constants/status';
import {
  GET_SERVICE_PROVIDER,
} from '../constants/ActionTypes';

const initialState = {
  id: null,
  status: IDLE,
  name: null,
  brandColor: null,
  logo: null,
  content: null,
  error: null,
};

/**
 * Service provider reducer.
 * @function serviceProvider
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function serviceProvider(state = initialState, action = {}) {
  switch (action.type) {
    case `${GET_SERVICE_PROVIDER}_PENDING`:
      return {
        ...state,
        status: PENDING,
        name: null,
        brandColor: null,
        logo: null,
        content: null,
        error: null,
      };
    case `${GET_SERVICE_PROVIDER}_SUCCESS`:
      return {
        ...state,
        status: SUCCESS,
        name: action.result.name,
        brandColor: action.result.brandColor,
        logo: action.result.logo,
        content: action.result.content,
      };
    case `${GET_SERVICE_PROVIDER}_FAIL`:
      return {
        ...state,
        status: FAIL,
        error: action.error,
      };
    default:
      return state;
  }
}

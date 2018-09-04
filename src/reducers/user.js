/**
 * Profile reducer.
 * @module reducers/profile
 */
import jwtDecode from 'jwt-decode';

import {
  USER_SESSION_LOGIN,
  USER_LOGOUT,
} from '../constants/ActionTypes';

const initialState = {
  token: null,
  placeId: null,
  userId: null,
};

/**
 * Decode the token and return it along with the state properties.
 * @param {string} token To decode
 * @returns {{token, placeId, userId}}
 */
export function getStateFromToken(token) {
  if (!token) {
    return initialState;
  }
  const { placeId, sub: userId } = jwtDecode(token);
  return { token, placeId, userId };
}

const actionsMap = {
  [USER_SESSION_LOGIN]: (state, action) => ({
    ...getStateFromToken(action.token),
  }),
  [USER_LOGOUT]: () => initialState,
};

/**
 * User reducer
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

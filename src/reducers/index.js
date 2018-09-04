/**
 * Root reducer.
 * @module ./root
 */

import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import addressSuggestion from './addressSuggestion';
import authorization from './authorization';
import appConfig from './appConfig';
import displayName from './displayName';
import policies from './policies';
import consent from './consent';
import serviceProvider from './serviceProvider';
import profile from './profile';
import places from './places';
import residents from './residents';
import placeLocation from './placeLocation';
import services from './services';
import allServices from './allServices';
import user from './user';

/**
 * Root reducer.
 * @function
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default combineReducers({
  reduxAsyncConnect,
  routing: routerReducer,
  form,
  addressSuggestion,
  authorization,
  appConfig,
  displayName,
  policies,
  consent,
  serviceProvider,
  profile,
  places,
  residents,
  placeLocation,
  services,
  allServices,
  user,
});

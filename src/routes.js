/**
 * Routes.
 * @module routes
 */

import React from 'react';
import { IndexRoute, Route } from 'react-router';
import isMobile from 'ismobilejs';

import {
  AddPlace,
  App,
  Authorize,
  Consent,
  EditPolicies,
  Home,
  ManagePolicies,
  MyHome,
  NotFound,
  Location,
  Login,
  Residents,
  Services,
  Styleguide,
  ViewPolicies,
} from './containers';
import { setSession } from '../src/actions';
import { isUserTokenValid } from '../src/helpers';

const checkToken = (store) => (nextState, replace) => {
  if (__CLIENT__) {
    const { location } = nextState;
    if (location) {
      const query = location.query;
      if (query.token) {
        store.dispatch(setSession(query.token));
        delete query.token;
        replace({ pathname: location.pathname, query });
      }
    }
  }
};

/**
 * Check if user session place matches place from query param
 * @function requireAuth
 * @returns {undefined}
 */
const requireAuth = store => nextState => { // eslint-disable-line complexity
  if (__CLIENT__) {
    const state = store.getState();
    const { params, location } = nextState;
    const query = location.query;

    if (query.clientId && query.policiesRequest) {
      // Requests initiated by oauth2client don't need user login
      return;
    }

    if (!state.user || params.placeId !== state.user.placeId) {
      // Redirect to login, when selected place does not match current user place
      window.location.href = `${state.appConfig.tippiqIdBaseUrl}/mijn-huissleutels`;
    }

    if (state.user && state.user.token && !isUserTokenValid(state.user.token)) {
      // Redirect to login, when token is expired
      window.location.href = `${state.appConfig.tippiqIdBaseUrl}/mijn-huissleutels`;
    }
  }
};

/**
 * Routes function.
 * @function
 * @returns {Object} Routes.
 */
export default (store) => (
  <Route
    path="/"
    component={App}
    onEnter={checkToken(store)}
    onChange={(prevState, nextState) => {
      if (isMobile.any && nextState.location.action === 'PUSH') {
        setTimeout(() => (window.scrollTo(0, 0)), 0);
      }
    }}
  >
    <IndexRoute component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/authorize" component={Authorize} />
    <Route path="/consent" component={Consent} />
    <Route path="/huis/:placeId/" onEnter={requireAuth(store)} onChange={requireAuth(store)} >
      <Route path="bewoners" component={Residents} />
      <Route path="diensten" component={Services} />
      <Route path="mijn-huis" component={MyHome} />
      <Route path="locatie" component={Location} />
      <Route path="huisregels" component={ManagePolicies} />
      <Route path=":serviceProviderId/huisregels" component={ViewPolicies} />
      <Route path=":serviceProviderId/huisregels/wijzigen" component={EditPolicies} />
    </Route>
    <Route path="/nieuw-huis" component={AddPlace} />
    <Route path="/styleguide" component={Styleguide} />
    <Route path="*" component={NotFound} status={404} />
  </Route>
);

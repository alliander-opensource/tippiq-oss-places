import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { ReduxAsyncConnect } from 'redux-connect';

import { browserHistory, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { configureStore } from './store';
import getRoutes from './routes';
import { Api, getUserToken, persistUserToken } from './helpers';
import { getStateFromToken } from './reducers/user';

const api = new Api();
const initialState = window.__data;  // eslint-disable-line no-underscore-dangle

initialState.user = getStateFromToken(getUserToken());
const store = configureStore(initialState, undefined, false, api);
persistUserToken(store);

const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider
    store={store}
    key="provider"
  >
    <Router
      render={(props) =>
        <ReduxAsyncConnect
          helpers={{ api }}
          {...props}
        />}
      history={history}
    >
      {getRoutes(store)}
    </Router>
  </Provider>,
  document.getElementById('content')
);

if (module.hot) {
  module.hot.accept();
}

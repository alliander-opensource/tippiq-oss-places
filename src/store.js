import createLogger from 'redux-logger';
import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import api from './middleware/api';
import piwik from './middleware/piwik';
import reducer from './reducers';

const debuggerLogger = createLogger();
const middleware = [thunk]; // add redux middleware

/**
 * Configure store.
 * @function configureStore
 * @param {Object} initialState state object
 * @param {Object} history state object
 * @returns {Object} Store.
 */
export function configureStore(initialState, history, logger, apiHelper) {
  const middlewares = [
    applyMiddleware(
      routerMiddleware(history),
      ...middleware,
      api(apiHelper),
      piwik,
    ),
  ];
  if (__DEBUG__) {
    if (logger) {
      middlewares.push(applyMiddleware(debuggerLogger));
    }
    middlewares.push((typeof window === 'object' &&
      typeof window.devToolsExtension !== 'undefined') ? window.devToolsExtension() : f => f);
  }
  const createStoreWithMiddleware = compose(...middlewares)(createStore);
  const store = createStoreWithMiddleware(reducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers/index'); // eslint-disable-line global-require

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

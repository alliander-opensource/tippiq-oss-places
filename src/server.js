// server
// import path from 'path';
import express from 'express';
import healthcheck from 'healthcheck-middleware';
import httpProxy from 'http-proxy';
import frameguard from 'frameguard';
import reactCookie from 'react-cookie';
import BPromise from 'bluebird';
import axios from 'axios';
import { pick } from 'lodash';
import modifyResponse from 'express-modify-response';

// SSR
import React from 'react';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';

import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, createMemoryHistory, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import debugLogger from './utils/debugnyan-poly';
import { Html, Api } from './helpers';
import ErrorPage from './error';
import getRoutes from './routes';
import { configureStore } from './store';
import { port, apiPort, apiHost, healthKey } from './config';
import serverLogger from './server-logger';

const debug = debugLogger('tippiq-places:server');

const apiUrl = `http://${apiHost}:${apiPort}/api`;

export default (parameters) => {
  const app = express();
  const staticPath = __dirname;

  app.use(serverLogger({
    name: 'tippiq-places',
    component: 'server',
    level: debug.level(),
  }));
  app.use(frameguard({ action: 'deny' }));

  // Serve static files
  app.use(express.static(__dirname));
  app.use('/assets', express.static(__dirname));

  // Proxy API calls to API server
  const proxy = httpProxy.createProxyServer({
    target: `http://${apiHost}:${apiPort}/api`,
    xfwd: true,
  });
  app.use('/api', (req, res) => proxy.web(req, res));
  proxy.on('error', (error, req, res) => {
    const json = { error: 'proxy_error', reason: error.message };
    debug.error(json);
    res.status(500).json(json);
  });

  app.use('/healthcheck',
    modifyResponse(
      req => req.header('x-health') !== healthKey,
      (req, res, body) => Promise
        .resolve(body)
        .then(buffer => (buffer.length ? buffer.toString() : '{}'))
        .then(JSON.parse)
        .then(obj => pick(obj, ['status', 'api.status', 'api.database.status', 'api.addresses.status']))
        .then(JSON.stringify),
    ),
    healthcheck({
      addChecks: (fail, pass) => {
        debug.info({ healthKey });
        BPromise
          .try(() => axios.get(`${apiUrl}/healthcheck`, {
            headers: { 'x-health': healthKey },
            timeout: 2000,
          }))
          .tap(debug.debug.bind(debug))
          .tapCatch(debug.error.bind(debug))
          .then(response => pass({ api: { status: 'success', ...response.data } }))
          .catch(fail);
      },
    })
  );

  app.use((req, res, next) => {
    reactCookie.setRawCookie(req.headers.cookie);
    next();
  });

  // React application rendering
  app.use((req, res) => {
    const api = new Api(req);
    const memoryHistory = createMemoryHistory(req.path);
    const store = configureStore({}, memoryHistory, false, api);
    const history = syncHistoryWithStore(memoryHistory, store);

    match({
      history,
      routes: getRoutes(store),
      location: req.originalUrl,
    }, (err, redirectInfo, routeState) => { // eslint-disable-line complexity
      if (redirectInfo && redirectInfo.redirectInfo) {
        res.redirect(redirectInfo.path);
      } else if (err) {
        res.error(err.message);
      } else if (routeState) {
        const statusCode = !routeState.params.splat ? 200 : 404;
        if (__SSR__) {
          loadOnServer({ ...routeState, store })
            .then(() => {
              const component = <Provider store={store}><ReduxAsyncConnect {...routeState} /></Provider>; // eslint-disable-line max-len
              res.set({ 'Cache-Control': 'public, max-age=600, no-transform' });
              res.status(statusCode).send(`<!doctype html> ${renderToStaticMarkup(<Html assets={parameters.chunks()} component={component} store={store} staticPath={staticPath} />)}`);
            })
            .catch(error => {
              const errorPage = <ErrorPage message={error.message} />;
              res.set({ 'Cache-Control': 'public, max-age=60, no-transform' });
              res.status(500).send(`<!doctype html> ${renderToStaticMarkup(errorPage)}`);
            });
        } else {
          const component = <Provider store={store}><RouterContext {...routeState} /></Provider>;
          res.set({ 'Cache-Control': 'public, max-age=60, no-transform' });
          res.status(statusCode).send(`<!doctype html> ${renderToStaticMarkup(<Html assets={parameters.chunks()} component={component} store={store} staticPath={staticPath} />)}`);
        }
      } else {
        res.set({ 'Cache-Control': 'public, max-age=3600, no-transform' });
        res.sendStatus(404);
      }
    });
  });

  // Start the HTTP server
  app.listen(port, (err) => {
    if (err) {
      debug.error(err);
    } else {
      debug.info({ port }, '🚧 Webpack frontend server');
    }
  });
};


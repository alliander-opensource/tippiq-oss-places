/**
 * Module for the backend API.
 * @module api
 */

import bodyParser from 'body-parser';
import express from 'express';
import passport from 'passport';
import sessions from 'client-sessions';
import { pick } from 'lodash';
import modifyResponse from 'express-modify-response';
import cors from 'cors';

import {
  tippiqIDJwtAuthentication,
  tippiqHoodJwtAuthentication,
  oauth2AccessTokenAuthentication,
  oauth2ClientAuthentication,
} from './modules/auth/auth';
import {
  tippiqIDJwt as tippiqIDJwtStrategy,
  tippiqHoodJwt as tippiqHoodJwtStrategy,
  oauth2AccessToken as oauth2AccessTokenStrategy,
  oauth2Client as oauth2ClientStrategy,
} from './modules/auth/strategies';
import config from './config';
import configRoutes from './modules/config';
import oauth2 from './modules/oauth2';
import policies from './modules/policies';
import places from './modules/places';
import policyTemplates from './modules/policy-templates';
import serviceProvider from './modules/service-provider';
import userPlaceRoles from './modules/user-place-roles';
import attributes from './modules/attributes';
import quickRegistration from './modules/quick-registration';
import messages from './modules/messages';
import addresses from './modules/addresses';
import redirect from './modules/redirect';
import cacheControl from './common/cache-control';
import apiHealthcheck from './api-healthcheck';

const app = express();

export { app as default };

/*
 TODO: replace with `app.use(cacheResponseDirective());` when it returns `this`
 import legacyExpires from 'express-legacy-expires';
 import cacheResponseDirective from 'express-cache-response-directive';
 */
app.use(cacheControl);
app.use(bodyParser.json({ limit: '10mb' })); // Needed for sending weekly notification
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '10mb',
}));
app.use(cors());

app.use(sessions({
  cookieName: 'session', // cookie name dictates the key name added to the request object
  secret: config.sessionSecret, // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended
  // by activeDuration milliseconds
}));

app.use(passport.initialize());
passport.use('tippiqIDJwt', tippiqIDJwtStrategy);
passport.use('tippiqHoodJwt', tippiqHoodJwtStrategy);
passport.use('oauth2AccessToken', oauth2AccessTokenStrategy);
passport.use('oauth2Client', oauth2ClientStrategy);

app.use(tippiqIDJwtAuthentication);
app.use(tippiqHoodJwtAuthentication);
app.use(oauth2AccessTokenAuthentication);
app.use(oauth2ClientAuthentication);

app.use('/healthcheck',
  modifyResponse(
    req => req.header('x-health') !== config.healthKey,
    (req, res, body) => Promise
      .resolve(body)
      .then(buffer => (buffer.length ? buffer.toString() : '{}'))
      .then(JSON.parse)
      .then(obj => pick(obj, ['status', 'database.status', 'addresses.status']))
      .then(JSON.stringify),
  ),
  apiHealthcheck(),
);

app.use('/config', configRoutes.routes);
app.use('/oauth2', oauth2.routes);
app.use('/policy-templates', policyTemplates.routes);
app.use('/service-provider', serviceProvider.routes);
app.use('/places', places.routes);
app.use('/places/:placeId/user-place-roles', userPlaceRoles.routes);
app.use('/places/:placeId/policies', policies.routes);
app.use('/places/:placeId/attributes', attributes.routes);
app.use('/places/:placeId/users/:userId/messages', messages.routes);
app.use('/quick-registration/', quickRegistration.routes);
app.use('/addresses/', addresses.routes);
app.use('/redirect', redirect.routes);

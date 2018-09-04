import _ from 'lodash';
import clientSessions from 'client-sessions';
import sessionRequest from 'supertest-session';

import { UserPlaceRoleRepository } from '../user-place-roles/repositories';
import { app, expect, request, getSignedJwt } from '../../common/test-utils';

// The cookie settings should be identical to those of the api, so we can fake cookies.
const SESSION_COOKIE_NAME = 'session';
const COOKIE_SECRET = 'Theyarepartoflotsofsessionsthatmakeupahazypartofmysessionlife.Jim Sullivan';
const COOKIE_DURATION = 24 * 60 * 60 * 1000;
const COOKIE_ACTIVE_DURATION = 1000 * 60 * 5;

const API_OAUTH2_AUTHORIZATION_URL = '/oauth2/authorization';
const API_OAUTH2_DECISION_URL = '/oauth2/authorization/decision';
const API_OAUTH2_TOKEN_URL = '/oauth2/token';
const CLIENT_ID = 'c63d545a-0633-11e6-b686-bb1d47039b65';
const CLIENT_SECRET = '123';
const CODE = 'mKDelyKU8qGlRX6BHpVwRRFo8lmyKbi_';

describe('OAuth2 Authorization', () => {
  let requestWithSession = null;

  beforeEach(() => {
    requestWithSession = sessionRequest(app);
  });

  describe('Authorization request', () => {
    it('should return client and transactionId values', () =>
      requestWithSession
        .get(`${API_OAUTH2_AUTHORIZATION_URL}?client_id=${CLIENT_ID}&response_type=code`)
        .expect(200)
        .expect(res => expect(res.body).to.have.property('client'))
        .expect(res => expect(res.body).to.have.property('transactionId'))
    );

    it('should set a session cookie', () =>
      requestWithSession
        .get(`${API_OAUTH2_AUTHORIZATION_URL}?client_id=${CLIENT_ID}&response_type=code`)
        .expect(200)
        .expect(res => expect(res.body).to.have.property('client'))
        .expect(res => expect(res.body).to.have.property('transactionId'))
        .expect((res) => {
          // TODO promisify this flow
          const isSessionCookie = cookie => cookie.name === SESSION_COOKIE_NAME;
          const sessionCookie = _.find(requestWithSession.cookies, isSessionCookie);
          const session = clientSessions.util.decode({
            cookieName: SESSION_COOKIE_NAME,
            secret: COOKIE_SECRET,
            duration: COOKIE_DURATION,
            activeDuration: COOKIE_ACTIVE_DURATION,
          }, sessionCookie.value);
          const transactionId = res.body.transactionId;
          const transaction = session.content.authorize[transactionId];
          return Promise
            .all([
              expect(session).to.have.property('content'),
              expect(session.content).to.have.property('authorize'),
              expect(session.content.authorize).to.have.property(res.body.transactionId),
              expect(transaction).to.have.property('protocol', 'oauth2'),
              expect(transaction).to.have.property('client', CLIENT_ID),
              expect(transaction).to.have.property('req'),
              expect(transaction.req).to.have.property('type', 'code'),
              expect(transaction.req).to.have.property('clientID', transaction.client),
            ]);
        })
    );

    it('should fail when no request parameters are present', () =>
      request(app)
        .get(API_OAUTH2_AUTHORIZATION_URL)
        .expect(400)
    );

    it('should fail when no client_id request parameter is present', () =>
      request(app)
        .get(`${API_OAUTH2_AUTHORIZATION_URL}?response_type=code`)
        .expect(400)
    );
  });

  describe('Authorization decision', () => {
    const transactionId = 'bZXkd7JX';

    let authToken;

    before(() =>
      getSignedJwt({
        sub: 'ff1cdd75-8800-44d9-9cfb-e803796de840',
        placeId: '47039b65-b1d4-9b65-33d5-b647033d545a',
      })
      .then((token) => {
        authToken = token;
        return UserPlaceRoleRepository
          .create({
            tippiqId: 'ff1cdd75-8800-44d9-9cfb-e803796de840',
            placeId: '47039b65-b1d4-9b65-33d5-b647033d545a',
            role: 'place_admin',
          });
      })
    );

    it('should return an authorization code', () => {
      const content = {};
      content[transactionId] = {
        protocol: 'oauth2',
        client: CLIENT_ID,
        req: {
          type: 'code',
          clientID: CLIENT_ID,
        },
      };
      const sessionCookie = clientSessions.util.encode({
        cookieName: SESSION_COOKIE_NAME,
        secret: COOKIE_SECRET,
        duration: COOKIE_DURATION,
        activeDuration: COOKIE_ACTIVE_DURATION,
      }, {
        authorize: content,
      });
      return request(app)
        .post(API_OAUTH2_DECISION_URL)
        .set('Cookie', `session=${sessionCookie}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cancel: false,
          transaction_id: transactionId,
        })
        .expect(200)
        .expect(res => expect(res).to.have.property('body'))
        .expect(res => expect(res.body).to.have.property('code'))
        .expect(res => expect(res.body.code).to.have.length.above(0));
    });

    it('should return not authorized when no auth token is set', () =>
      requestWithSession
        .post(API_OAUTH2_DECISION_URL)
        .expect(403)
        .expect(res => expect(res).to.have.property('body'))
        .expect(res => expect(res.body).to.deep.equal({
          success: false,
          message: 'Geen toegang: je hebt niet de juiste toestemming.',
        }))
    );
  });
});

// TODO move endpoints to their corresponding action file
// TODO split this file into two separate e2e test files
describe('OAuth2 exchange code for token', () => {
  it('should return a token for a valid code', () =>
    request(app)
      .post(API_OAUTH2_TOKEN_URL)
      .auth(CLIENT_ID, CLIENT_SECRET)
      .send({
        grant_type: 'authorization_code',
        code: CODE,
        client_id: CLIENT_ID,
      })
      .expect(200)
  );

  xit('should return a token only once', () =>
    request(app)
      .post(API_OAUTH2_TOKEN_URL)
      .auth(CLIENT_ID, CLIENT_SECRET)
      .send({
        grant_type: 'authorization_code',
        code: CODE,
        client_id: CLIENT_ID,
      })
      .expect(500)
  );

  it('should reject an invalid code', () =>
    request(app)
      .post(API_OAUTH2_TOKEN_URL)
      .auth(CLIENT_ID, CLIENT_SECRET)
      .send({
        grant_type: 'authorization_code',
        code: 'invalid-code',
        client_id: CLIENT_ID,
      })
      .expect(500) // TODO should be 400 when we update error handler
      .expect(res => expect(res).to.have.property('body'))
      .expect(res => expect(res.body).to.deep.equal({
        error: 'server_error',
        error_description: 'Invalid Request',
      })) // TODO should be our error message
  );

  it('should reject when authentication is invalid', () =>
    request(app)
      .post(API_OAUTH2_TOKEN_URL)
      .auth(CLIENT_ID, 'invalid-secret')
      .send({
        grant_type: 'authorization_code',
        code: CODE,
        client_id: CLIENT_ID,
      })
      .expect(500) // TODO should be 400 (or 403?) when we update error handler
      .expect(res => expect(res).to.have.property('body'))
      .expect(res => expect(res.body).to.deep.equal({
        error: 'server_error',
        error_description: 'Invalid Request',
      })) // TODO should be our error message
  );
});

import BPromise from 'bluebird';

import { app, expect, request, getSignedJwt } from '../../../common/test-utils';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import validUserPlaceRole from '../../../testdata/valid-user-place-role';
import validPolicy from '../../../testdata/valid-policy';
import validPlace from '../../../testdata/valid-place';
import { PlaceRepository } from '../../places/repositories';
import otherValidPolicy from '../../../testdata/other-valid-policy';
import { OAuth2AccessTokenRepository } from '../../oauth2/repositories';
import config from '../../../config';
import ServerMock from '../../../common/server-mock';

const clientId = 'c63d545a-0633-11e6-b686-bb1d47039b65';

describe('Get all policies', () => { // eslint-disable-line max-statements
  config.tippiqIdBaseUrl = 'http://localhost:13001';
  const userPlaceRole = validUserPlaceRole();

  const tippiqIdMockServer = new ServerMock({ port: 13001 });
  let authToken;

  before('get token', () => getSignedJwt({ sub: validPolicy.userId }).then(token => {
    authToken = token;
  }));

  before('mock server', () => tippiqIdMockServer.start());
  after('mock server', () => tippiqIdMockServer.stop());

  let policyUrl;
  let policyIds;
  let placeUrl;
  let userPlaceRoleId;

  before('place', () =>
    PlaceRepository
      .create(validPlace)
      .tap(place => {
        placeUrl = `/places/${place.get('id')}`;
        userPlaceRole.tippiqId = validPolicy.userId;
        userPlaceRole.placeId = place.get('id');
      })
  );

  before('create user-place-role', () => {
    UserPlaceRoleRepository
      .create(userPlaceRole)
      .then(userPlaceRoleModel => {
        userPlaceRoleId = userPlaceRoleModel.get('id');
      });
  });

  before('policy', done => {
    request(app)
      .post(`${placeUrl}/policies?clientId=${clientId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send([
        { ...validPolicy, enabled: true },
        { ...otherValidPolicy, enabled: true },
      ])
      .end((err, res) => {
        policyIds = res.body.ids;
        policyUrl = res.headers.location;

        if (err) {
          return done(err);
        }
        return done();
      });
  });

  after('policyIds', () => {
    const bulk = policyIds
      .map(id =>
        request(app)
          .del(`${policyUrl}/${id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200));

    return BPromise.all(bulk);
  });

  after('place', () =>
    request(app)
      .del(placeUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
  );

  it('should include all the values when no user is specified', () =>
    request(app)
      .get(`${placeUrl}/policies?clientId=${clientId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .set('Accept', 'application/json')
      .expect(200)
      // Should be 2, but in Docker Cloud, this could also be 3 because of the previous test run
      .expect(res => expect(res.body).to.have.length.of.at.least(2))
      .expect(res =>
        res.body.every(policy => {
          expect(policy).to.have.property('id');
          expect(policy).to.have.property('userId');
          expect(policy).to.have.property('templateSlug');
          expect(policy).to.have.property('actorLabel');
          expect(policy).to.have.property('actionLabel');
          expect(policy).to.have.property('acteeLabel');
          expect(policy).to.have.property('conditions');
          expect(policy).to.have.property('description');
          expect(policy).to.have.property('serviceProviderId');
          expect(policy).to.have.property('criticalDisableWarning');
          expect(policy).to.have.property('signature');
          return true;
        })
      )
  );

  describe('with OAuth2 token', () => {
    let tokenId;

    before(done => {
      OAuth2AccessTokenRepository
        .create({
          token: 'testtoken',
          userId: userPlaceRoleId,
          clientId: validPolicy.serviceProviderId,
        })
        .then(record => {
          tokenId = record.get('id');
          done();
        });
    });

    it('should include 2 policies when a valid OAuth2 header is provided', () =>
      request(app)
        .get(`${placeUrl}/policies`)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer testtoken')
        .expect(200)
        .expect(res => expect(res.body).to.have.lengthOf(2))
    );

    after('token', () => OAuth2AccessTokenRepository.deleteById(tokenId));
  });

  describe('with JWT token', () => {
    it('should include 2 policies when a valid JWT header and clientId are provided', () =>
      request(app)
        .get(`${placeUrl}/policies?clientId=${validPolicy.serviceProviderId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => expect(res.body).to.have.lengthOf(2))
    );

    it('should throw an error when a valid JWT header is provided but no clientId', () =>
      request(app)
        .get(`${placeUrl}/policies`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400)
    );
  });
});

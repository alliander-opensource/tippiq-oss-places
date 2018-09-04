import BPromise from 'bluebird';

import { app, expect, request, getSignedJwt } from '../../../common/test-utils';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import validUserPlaceRole from '../../../testdata/valid-user-place-role';
import validPolicy from '../../../testdata/valid-policy';
import validPlace from '../../../testdata/valid-place';
import { PlaceRepository } from '../../places/repositories';

import ServerMock from '../../../common/server-mock';
import config from '../../../config';

describe('Update policy', () => { // eslint-disable-line max-statements
  config.tippiqIdBaseUrl = 'http://localhost:13001';
  const userPlaceRole = validUserPlaceRole();

  const tippiqIdMockServer = new ServerMock({ port: 13001 });
  let authToken;
  let policyUrl;
  let placeUrl;

  before('mock server', () => tippiqIdMockServer.start());
  after('mock server', () => tippiqIdMockServer.stop());

  before(() => getSignedJwt({ sub: validPolicy.userId }).then(token => {
    authToken = token;
  }));

  before('place', () =>
    PlaceRepository
      .create(validPlace)
      .tap(place => {
        placeUrl = `/places/${place.get('id')}`;
        userPlaceRole.tippiqId = validPolicy.userId;
        userPlaceRole.placeId = place.get('id');
      })
  );

  before('create user-place-role', () => UserPlaceRoleRepository.create(userPlaceRole));

  before(done => {
    request(app)
      .post(`${placeUrl}/policies?clientId=c63d545a-0633-11e6-b686-bb1d47039b65`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send(validPolicy)
      .end((err, res) => {
        policyUrl = res.headers.location;
        return err ? done(err) : done();
      });
  });

  after('policyUrl', () =>
    request(app)
      .del(policyUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
  );

  after('place', () =>
    request(app)
      .del(placeUrl)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
  );

  it('should update unaltered policy', () =>
    request(app)
      .put(policyUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send(validPolicy)
      .expect(200)
      .expect(res => expect(res.body).to.have.property('userId', validPolicy.userId))
  );

  it('should not be able to update policy without slug ', () =>
    request(app)
      .put(policyUrl)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ ...{ ...validPolicy }, ...{ templateSlug: null } })
      .expect(400)
      .expect(res => expect(res.body).to.have.property('success', false))
  );

  it('should be able to update mutable policy values ', () => {
    const allowedFields = {
      actorLabel: 'bla',
      actionLabel: 'bla',
      acteeLabel: 'bla',
      condition: { foo: 'bar' },
    };
    const promises = [];

    Object.keys(allowedFields, key => {
      const alteredPolicy = { ...validPolicy };

      alteredPolicy[key] = allowedFields[key];
      promises.push(request(app)
        .put(policyUrl)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authToken}`)
        .send(alteredPolicy)
        .expect(200)
      );
    });
    return BPromise.all(promises);
  });

  it('should fail updating a policy with altered values', () => {
    const immutableFields = {
      serviceProviderId: '00000000-0000-0000-0000-000000000000',
      templateSlug: 'my_own_slug_fest',
      title: 'Altered title',
      description: 'Bogus',
      critical: false,
      criticalDisableWarning: 'Go directly to Jail. Do not pass GO, do not collect $200.',
    };
    const promises = [];

    Object.keys(immutableFields, key => {
      const alteredPolicy = { ...validPolicy };

      alteredPolicy[key] = immutableFields[key];
      promises.push(request(app)
        .put(policyUrl)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authToken}`)
        .send(alteredPolicy)
        .expect(400)
        .expect(res => expect(res.body).to.have.property('success', false))
      );
    });
    return BPromise.all(promises);
  });
});

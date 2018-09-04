/* eslint-disable max-nested-callbacks */
import { request, app, expect, getSignedJwt } from '../../../common/test-utils';
import { isValidUUID } from '../../../common/validation-utils';
import validPolicy from '../../../testdata/valid-policy';
import validPlace from '../../../testdata/valid-place';
import otherValidPolicy from '../../../testdata/other-valid-policy';
import { PolicyRepository } from '../repositories';
import { PlaceRepository } from '../../places/repositories';
import ServerMock from '../../../common/server-mock';
import config from '../../../config';

const clientId = 'c63d545a-0633-11e6-b686-bb1d47039b65';

describe('Add policy', () => {
  config.tippiqIdBaseUrl = 'http://localhost:13001';

  const tippiqIdMockServer = new ServerMock({ port: 13001 });
  let authToken;

  before(() => getSignedJwt({ sub: validPolicy.userId }).then((token) => {
    authToken = token;
  }));

  before('mock server', () => tippiqIdMockServer.start());
  after('mock server', () => tippiqIdMockServer.stop());

  describe('adding a single policy', () => {
    let policyUrl;
    let placeUrl;
    let placeId;

    before('place', () =>
      PlaceRepository
        .create(validPlace)
        .tap(place => {
          placeUrl = `/places/${place.get('id')}`;
          placeId = place.get('id');
        }));

    after('policyUrl', () =>
      (policyUrl ?
        request(app)
          .del(policyUrl)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
        : true)
    );

    after('place', () => PlaceRepository.deleteById(placeId));

    it('should add a policy when valid data is provided', () => {
      let parts;
      return request(app)
        .post(`${placeUrl}/policies?clientId=${clientId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validPolicy)
        .expect(201)
        .expect(res => (policyUrl = res.headers.location))
        .expect(res => (parts = res.headers.location.split('/')))
        .expect(() => expect(parts.length).to.equal(5))
        .expect(() => expect(parts[3]).to.equal('policies'))
        .expect(() => expect(isValidUUID(parts[2])).to.equal(true))
        .expect(() => expect(tippiqIdMockServer.requests()[0].body).to.have.deep
          .property('data.policies[0].title', validPolicy.title)
        );
    });
  });

  describe('adding multiple policies', () => {
    let policyUrl;
    let placeUrl;
    let policyIds;
    let placeId;

    before('place', () =>
      PlaceRepository
        .create(validPlace)
        .tap(place => {
          placeId = place.get('id');
          placeUrl = `/places/${place.get('id')}`;
        })
    );

    afterEach('policies', () =>
      Promise.all(
        policyIds
          .map(id => request(app)
            .del(`${policyUrl}/${id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200)
          )
      )
    );

    after('place', () => PlaceRepository.deleteById(placeId));

    it('should add multiple policies', () =>
      request(app)
        .post(`${placeUrl}/policies?clientId=${clientId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authToken}`)
        .send([
          { ...validPolicy, enabled: true },
          { ...otherValidPolicy, enabled: true },
        ])
        .expect((res) => {
          policyIds = res.body.ids;
          policyUrl = res.headers.location;
        })
        .expect(201)
        .expect(res => expect(res.body.ids.length).to.equal(2))
        .expect(res => expect(isValidUUID(res.body.ids[0])).to.equal(true))
        .expect(res => expect(isValidUUID(res.body.ids[1])).to.equal(true))
    );

    it('should remove disabled policies', done => {
      request(app)
        .post(`${placeUrl}/policies?clientId=${clientId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authToken}`)
        .send([
          { ...validPolicy, enabled: true },
        ])
        .end(() =>
          request(app)
            .post(`${placeUrl}/policies?clientId=${clientId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${authToken}`)
            .send([
              { ...validPolicy, enabled: false },
              { ...otherValidPolicy, enabled: true },
            ])
            .end((error, response) => {
              Promise
                .all([
                  PolicyRepository.findAll({
                    template_slug: validPolicy.templateSlug,
                    user_id: validPolicy.userId,
                    place_id: placeId,
                  }),
                  PolicyRepository.findAll({
                    template_slug: otherValidPolicy.templateSlug,
                    user_id: validPolicy.userId,
                    place_id: placeId,
                  }),
                ])
                .then((policies) => {
                  expect(policies[0].length).to.equal(0);
                  expect(policies[1].length).to.equal(1);
                  policyIds = response.body.ids;
                  done();
                });
            })
        );
    });

    it('should not add the same policies twice', done => {
      request(app)
        .post(`${placeUrl}/policies?clientId=${clientId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authToken}`)
        .send([
          { ...validPolicy, enabled: true },
        ])
        .end((err, res) => {
          policyIds = res.body.ids;
          request(app)
            .post(`${placeUrl}/policies?clientId=${clientId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${authToken}`)
            .send([
              { ...validPolicy, enabled: true },
            ])
            .end(() => {
              PolicyRepository
                .findAll({
                  template_slug: validPolicy.templateSlug,
                  user_id: validPolicy.userId,
                  place_id: placeId,
                })
                .then((policies) => {
                  expect(policies.length).to.equal(1);
                  done();
                });
            });
        });
    });
  });

  describe('adding an invalid policy', () => {
    let placeUrl;
    let placeId;

    before('place', () =>
      PlaceRepository
        .create(validPlace)
        .tap(place => {
          placeUrl = `/places/${place.get('id')}`;
          placeId = place.get('id');
        }));

    after('place', () => PlaceRepository.deleteById(placeId));

    it('should not be able to update policy without slug ', () =>
      request(app)
        .post(`${placeUrl}/policies?clientId=${clientId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...validPolicy, templateSlug: null })
        .expect(500)
    );

    it('should fail adding a policy with values not matching the template (if set)', () => {
      const immutableFields = {
        serviceProviderId: '00000000-0000-0000-0000-000000000000',
        templateSlug: 'my_own_slug_fest',
        title: 'Altered title',
        description: 'Bogus',
        critical: false,
        criticalDisableWarning: 'Go directly to Jail. Do not pass GO, do not collect $200.',
      };
      const promises = [];

      Object.keys(immutableFields, (key) => {
        const alteredPolicy = { ...validPolicy };

        alteredPolicy[key] = immutableFields[key];
        promises.push(request(app)
          .post(`${placeUrl}/policies?clientId=${clientId}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${authToken}`)
          .send(alteredPolicy)
          .expect(500)
          .expect(res => expect(res.body).to.have.property('success', false))
        );
      });
      return Promise.all(promises);
    });
  });
});

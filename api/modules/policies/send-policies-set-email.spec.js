import BPromise from 'bluebird';

import { expect } from '../../common/test-utils';
import sendPoliciesSetEmail from './send-policies-set-email';
import validPolicy from '../../testdata/valid-policy';
import { PolicyRepository } from './repositories';
import { UserPlaceRoleRepository } from '../user-place-roles/repositories';
import { PlaceRepository } from '../places/repositories';
import ServerMock from '../../common/server-mock';
import config from '../../config';

const clientId = 'c63d545a-0633-11e6-b686-bb1d47039b65';
const userId = '00000000-0000-0000-0000-000000000000';
const placeId = '00000001-0001-0000-0000-000000000000';
const tippiqId = '00000001-0001-0000-0000-000000000000';

const inputPolicyOne = {
  ...validPolicy,
  placeId,
  title: 'Reference 3P mag mijn gegevens uitlezen.',
};
const inputPolicyTwo = {
  ...validPolicy,
  placeId,
  title: 'Reference 3P mag mijn gegevens anoniem delen.',
};

describe('Send email', () => {
  config.tippiqIdBaseUrl = 'http://localhost:13001';

  const tippiqIdMockServer = new ServerMock({ port: 13001 });

  let testPolicyOne;
  let testPolicyTwo;

  beforeEach('MockServer', () => tippiqIdMockServer.start());
  afterEach('MockServer', () => tippiqIdMockServer.stop());

  before('create user-place-role', () =>
    PlaceRepository
      .create({ id: placeId }, { method: 'insert' })
      .then(() =>
        UserPlaceRoleRepository
          .create({ placeId, tippiqId, role: 'test' }))
  );

  before('create policies', () => BPromise
    .all([
      PolicyRepository.create(inputPolicyOne).tap(policy => {
        testPolicyOne = policy;
      }),
      PolicyRepository.create(inputPolicyTwo).tap(policy => {
        testPolicyTwo = policy;
      }),
    ])
  );

  after('delete policies', () => BPromise
    .all([
      PolicyRepository.deleteById(testPolicyOne.id),
      PolicyRepository.deleteById(testPolicyTwo.id),
    ])
  );

  after('delete place', () => PlaceRepository.deleteById(placeId));

  it('should send an email request for a single policy', () =>
    sendPoliciesSetEmail(clientId, userId, testPolicyOne)
      .tap(() => BPromise
        .all([
          expect(tippiqIdMockServer.requests()[0].body)
            .to.have.deep.property('data.serviceName', 'Fake Third Party'),
          expect(tippiqIdMockServer.requests()[0].body)
            .to.have.deep.property('data.policies[0].title', inputPolicyOne.title),
        ])
      )
  );

  it('should send an email request for multiple policies', () =>
    sendPoliciesSetEmail(clientId, userId, [testPolicyOne, testPolicyTwo])
      .tap(() => BPromise
        .all([
          expect(tippiqIdMockServer.requests()[0].body)
            .to.have.deep.property('data.policies[0].title', inputPolicyOne.title),
          expect(tippiqIdMockServer.requests()[0].body)
            .to.have.deep.property('data.policies[1].title', inputPolicyTwo.title),
        ])
      )
  );
});

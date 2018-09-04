// These tests will add policies to the database, but it can only run once.
// If you want to rerun tests, delete the policies from the db manually.

import { AttributeRepository } from '../../../api/modules/attributes';
import { PolicyRepository } from '../../../api/modules/policies/repositories';
import { UserPlaceRoleRepository } from '../../../api/modules/user-place-roles';
import { PlaceRepository } from '../../../api/modules/places';
import { getSignedJwt } from '../../../api/common/test-utils';
import { insertTestData, removeTestData } from '../../../api/common/seed-utils';
import validAttribute from '../../../api/testdata/valid-attribute';

const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-manage-policies'))),
  heading: () => element(by.css('h1')),
  consentPanel: () => element(by.id('consentPanel')),
  submitPolicyTemplatesButton: () => element(by.id('submitPolicyTemplates')),
  policyTemplate: () => element(by.id('f3p-share-energy-data-neighbours')),
  requiredPolicyTemplate: () => element(by.id('f3p-read-energy-data')),
  validationErrors: () => element.all(by.css('.text-danger')),
};

// Base 64 encoded policies.
const policiesRequest = 'W3sidGl0bGUiOiJVaXRsZXplbiB2YW4gZW5l' +
  'cmdpZWRhdGEiLCJwb2xpY2llcyI6WyJmM3AtcmVhZC1lbmVyZ3ktZGF0YS' +
  'JdfSx7InRpdGxlIjoiRGVsZW4gdmFuIGVuZXJnaWVkYXRhIiwicG9saWNp' +
  'ZXMiOlsiZjNwLXNoYXJlLWVuZXJneS1kYXRhLW5laWdoYm91cnMiXX1d';

const clientId = 'c63d545a-0633-11e6-b686-bb1d47039b65';
const userId = '00000000-0000-0000-0000-000000000000';
const placeId = '00000001-0001-0000-0000-000000000000';
const tippiqId = '00000001-0001-0000-0000-000000000000';

describe('Manage Policies container', () => {
  beforeAll(() => insertTestData());
  afterAll(() => removeTestData());

  beforeAll(() => PlaceRepository
    .create({ id: placeId }, { method: 'insert' })
    .tap(() => {
      afterAll(() => PlaceRepository.deleteById(placeId));
    })
    .then(() => Promise
      .all([
        AttributeRepository
          .create({
            place_id: placeId,
            type: validAttribute.data.attributeType,
            ...validAttribute,
          }),
        UserPlaceRoleRepository
          .create({ placeId, tippiqId, role: 'test' }),
      ])
    )
  );

  afterAll(() => PolicyRepository.deleteWhere({ user_id: userId }));

  afterAll(() => AttributeRepository.deleteWhere({ place_id: placeId }));

  afterAll(() => UserPlaceRoleRepository.deleteWhere({ place_id: placeId }));

  afterAll(() => PlaceRepository.deleteById(placeId));

  describe('user without policies set', () => {
    let authToken;

    beforeAll(() => getSignedJwt({ sub: userId, placeId }).then((token) => {
      authToken = token;
    }));

    beforeAll(() => {
      browser.get(`/huis/${placeId}/huisregels?` +
        `token=${authToken}&` +
        `clientId=${clientId}` +
        '&response_type=code&redirect_uri=/' +
        `&policiesRequest=${policiesRequest}`);
    });

    it('should show consent', () => {
      expect(page.consentPanel().isPresent()).toBe(true);
    });

    it('should list the policy templates', () => {
      expect(page.policyTemplate().isPresent()).toBe(true);
      expect(page.requiredPolicyTemplate().isPresent()).toBe(true);
    });

    it('should display validation errors when critical policy not checked', () => {
      expect(page.validationErrors().count()).toEqual(0);
      page.submitPolicyTemplatesButton().click();
      expect(page.validationErrors().count()).toEqual(1);
    });

    it('should redirect to the redirect_uri if the policy templates are saved', () => {
      page.requiredPolicyTemplate().click(); // accept critical policy
      page.submitPolicyTemplatesButton().click();
      expect(page.validationErrors().count()).toEqual(0);
    });
  });

  describe('showing previously saved policies', () => {
    let authToken;

    beforeAll(() => getSignedJwt({ sub: userId, placeId }).then((token) => {
      authToken = token;
    }));

    beforeAll(() => {
      browser.get(`/huis/${placeId}/huisregels?` +
        `token=${authToken}&` +
        `clientId=${clientId}` +
        `&redirect_uri=/&policiesRequest=${policiesRequest}`);
      browser.wait(page.isLoaded(), 10000);
    });

    it('should not show consent', () => {
      expect(page.consentPanel().isPresent()).toBe(false);
    });

    it('should display previously saved policies', () => {
      expect(page.policyTemplate().isPresent()).toBe(true);
      expect(page.requiredPolicyTemplate().isPresent()).toBe(true);
    });

    xit('should still have required policy checked', () => {
      expect(page.requiredPolicyTemplate().getAttribute('checked')).toEqual('true');
    });
  });
});

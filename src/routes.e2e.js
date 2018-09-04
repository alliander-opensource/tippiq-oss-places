import { PlaceRepository } from '../api/modules/places';
import { UserPlaceRoleRepository } from '../api/modules/user-place-roles';
import { insertTestData, removeTestData } from '../api/common/seed-utils';
import { getSignedJwt } from '../api/common/test-utils';

const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-residents'))),
};

const placeId = '00000001-0000-0000-0000-000000000000';
const tippiqId = '00000001-0001-0000-0000-000000000000';

describe('Routes', () => {
  let authToken;
  let expiredToken;
  beforeAll(() => insertTestData());
  afterAll(() => removeTestData());

  beforeAll(() =>
    PlaceRepository
      .create({ id: placeId }, { method: 'insert' })
      .then(() =>
        UserPlaceRoleRepository
          .create({ placeId, tippiqId, role: 'place_admin' }))
  );
  afterAll(() =>
    UserPlaceRoleRepository
      .deleteWhere({ place_id: placeId })
      .then(() =>
        PlaceRepository.deleteById(placeId)));

  beforeAll(() => getSignedJwt({ sub: tippiqId, placeId }).then((token) => {
    authToken = token;
  }));

  beforeAll(() => getSignedJwt({ sub: tippiqId, placeId }, { expiresIn: '0s' }).then((token) => {
    expiredToken = token;
  }));

  beforeAll(() => {
    browser.get(`/login?token=${authToken}&redirect_uri=/huis/${placeId}/bewoners`);
    browser.wait(page.isLoaded(), 10000);
  });

  it('should redirect to the login page for an expired token', () => {
    browser.executeScript(`window.localStorage.setItem('authToken', '${expiredToken}');`);

    // Navigate to other valid page to trigger redirect to login page.
    browser.get(`/huis/${placeId}/locatie`);

    // Expect redirect
    expect(browser.getCurrentUrl()).not.toContain('locatie');
  });
});

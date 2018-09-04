import { PlaceRepository } from '../../../api/modules/places';
import { UserPlaceRoleRepository } from '../../../api/modules/user-place-roles';
import { insertTestData, removeTestData } from '../../../api/common/seed-utils';
import { getSignedJwt } from '../../../api/common/test-utils';

const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-residents'))),
  residents: () => element.all(by.css('#page-residents .Residents__tableColumn___LzQ8B')),
};

const placeId = '00000001-0000-0000-0000-000000000000';
const tippiqId = '00000001-0001-0000-0000-000000000000';

describe('Residents container', () => {
  let authToken;
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

  beforeAll(() => {
    browser.get(`/login?token=${authToken}&redirect_uri=/huis/${placeId}/bewoners`);
    browser.wait(page.isLoaded(), 10000);
  });

  it('should list the residents', () => {
    expect(page.residents().count()).toEqual(1);
  });
});

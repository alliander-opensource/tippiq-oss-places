import { getSignedJwt } from '../../../api/common/test-utils';
import { PlaceRepository } from '../../../api/modules/places';
import { UserPlaceRoleRepository } from '../../../api/modules/user-place-roles';
import { AttributeRepository } from '../../../api/modules/attributes';
import { insertTestData, removeTestData } from '../../../api/common/seed-utils';
import validAttribute from '../../../api/testdata/valid-attribute';

const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-location'))),
  heading: () => element(by.css('h3')),
  location: () => element(by.css('.location-name')),
};

const placeId = '00000001-0000-0000-0000-000000000000';
const userTippiqId = '00000001-0001-0000-0000-000000000000';

describe('Location container', () => {
  let authToken;

  beforeAll(() => insertTestData());
  afterAll(() => removeTestData());

  beforeAll(() =>
    PlaceRepository
      .create({ id: placeId }, { method: 'insert' })
      .then(() =>
        UserPlaceRoleRepository
          .create({ placeId, tippiqId: userTippiqId, role: 'place_admin' })
          .then(() =>
            AttributeRepository
              .create({
                place_id: placeId,
                type: validAttribute.data.attributeType,
                ...validAttribute,
              })
          )
      )
  );

  beforeAll(() => getSignedJwt({ sub: userTippiqId, placeId }).then(token => {
    authToken = token;
  }));

  afterAll(() => AttributeRepository.deleteWhere({ place_id: placeId }));

  afterAll(() => PlaceRepository.deleteById(placeId));

  beforeAll(() => {
    browser.get(`/huis/${placeId}/locatie?token=${authToken}`);
    browser.wait(page.isLoaded(), 10000);
  });

  it('should show a heading', () => {
    expect(page.heading().isPresent()).toBe(true);
  });

  it('should list the location', () => {
    expect(page.location().isPresent()).toBe(true);
  });
});

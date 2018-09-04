import { getSignedJwt } from '../../../api/common/test-utils';
import { PlaceRepository } from '../../../api/modules/places';
import { UserPlaceRoleRepository } from '../../../api/modules/user-place-roles';
import { AttributeRepository } from '../../../api/modules/attributes';
import { insertTestData, removeTestData } from '../../../api/common/seed-utils';
import validAttribute from '../../../api/testdata/valid-attribute';

const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-my-house'))),
  styleguide: () => element(by.id('page-styleguide')),
  navbar: () => element(by.css('nav.navbar')),
  brandAnchor: () => element(by.css('a.navbar-brand')),
};

const tippiqId = '00000001-0001-0000-0000-000000000000';

describe('Header container', () => {
  let authToken;
  let testPlaceId;

  beforeAll(() => insertTestData());
  afterAll(() => removeTestData());

  beforeAll(() =>
    PlaceRepository
      .create({}, { method: 'insert' })
      .then(place => place.get('id'))
      .tap(placeId => {
        testPlaceId = placeId;
      })
      .then(placeId => Promise
        .all([
          UserPlaceRoleRepository
            .create({ placeId, tippiqId, role: 'place_admin' }),
          AttributeRepository
            .create({
              place_id: placeId,
              type: validAttribute.data.attributeType,
              ...validAttribute,
            }),
          getSignedJwt({ sub: tippiqId, placeId, action: 'tippiq-id.login_session' })
            .then(token => {
              authToken = token;
            }),
        ])
      )
  );

  beforeAll(() => {
    browser.get(`/login?token=${authToken}&redirect_uri=/styleguide`);
    browser.driver.wait(protractor.ExpectedConditions.visibilityOf(page.styleguide()), 10000);
  });

  afterAll(() => AttributeRepository.deleteWhere({ place_id: testPlaceId }));

  afterAll(() => UserPlaceRoleRepository.deleteWhere({ place_id: testPlaceId }));

  afterAll(() => PlaceRepository.deleteById(testPlaceId));

  it('should render the header navbar', () => {
    expect(page.navbar().isPresent()).toBe(true);
  });

  it('should have link to mijn-huis as brand', () => {
    expect(page.brandAnchor().isPresent()).toBe(true);
    expect(page.brandAnchor().getAttribute('href')).toContain('mijn-huis');
  });
});

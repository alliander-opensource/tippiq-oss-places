import { getSignedJwt } from '../../../api/common/test-utils';

export const page = {
  styleguide: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-styleguide'))),
  myHome: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-my-house'))),
};

describe('Home container', () => {
  beforeEach(() => {
    browser.executeScript('window.localStorage.clear();');
  });

  // config.landingBaseUrl should point to the styleguide during this test
  describe('without a token', () => {
    it('should redirect to the external landing page', () => {
      browser.get('/?test=without-token');
      browser.wait(page.styleguide(), 10000);
    });
  });

  describe('with a token', () => {
    beforeEach(() => {
      // create token from test place and user
      getSignedJwt({
        sub: '90c7c881-4b85-4d84-8867-f52e89525d76',
        placeId: 'fd1a072c-f8d7-415b-9561-c8f003ba5bbd',
      })
        .then(token => {
          // Store token in localstorage
          browser.get(`/login?token=${token}&redirect_uri=/styleguide?test=with-token`, 10000);
        });
    });
    afterAll(() => {
      browser.executeScript('window.localStorage.clear();');
    });
    it('should redirect to my home', () => {
      browser.getCurrentUrl(); // Give browser a punch to prevent failures on timeout
      browser.get('/?test=with-token');
      browser.wait(page.myHome(), 10000);
    });
  });
});

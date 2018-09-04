const page = {
  isLoaded: () => protractor.ExpectedConditions.presenceOf(element(by.id('page-consent'))),
  heading: () => element(by.css('h1')),
  handleConsentButton: () => element(by.id('consentRequestButton')),
};

describe('Consent container', () => {
  it('shows a heading on the start screen', () => {
    browser.get('/consent');
    browser.wait(page.isLoaded(), 10000);
    expect(page.heading().isPresent()).toBe(true);
  });
});

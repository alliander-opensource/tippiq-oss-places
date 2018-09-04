import { search } from './addressesApi';
import config from '../config';
import { expect, interceptAdresses } from '../common/test-utils';

describe('search', () => {
  before('interceptAddresses', () => {
    interceptAdresses(config.tippiqAddressesBaseUrl);
  });

  it('should return address suggestions based on a query string', () => Promise.all([
    expect(search('ams')).to.eventually.be.an('array'),
  ]));
});

import { expect } from '../../../common/test-utils';
import ServiceProviderRepository from './service-provider-repository';

describe('ServiceProviderRepository', () => {
  describe('findById', () => {
    const id = 'c63d545a-0633-11e6-b686-bb1d47039b65';
    it('should find an existing ServiceProvider by id', () =>
      ServiceProviderRepository
        .findById(id)
        .tap(model => expect(model).to.exist)
    );
  });

  describe('findByPlaceId', () => {
    const id = '47039b65-b1d4-9b65-33d5-b647033d545a';
    it('should find a ServiceProvider by place id', () =>
      ServiceProviderRepository
        .findByPlaceId(id)
        .tap(result => expect(result.models).to.not.be.empty)
    );
  });
});

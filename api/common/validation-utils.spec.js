import { expect } from './test-utils';
import { isValidUUID } from './validation-utils';

describe('validation utils', () => {
  it('should validate a valid uuid', () => {
    expect(isValidUUID('37181aa2-560a-11e5-a1d5-c7050c4109ab')).to.equal(true);
  });

  it('should validate an invalid uuid', () => {
    expect(isValidUUID('abc')).to.equal(false);
  });
});

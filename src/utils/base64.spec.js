import { encodeJSON, decodeJSON } from './base64';

describe('base64', () => {
  const object = {
    key: 'value',
    array: [{
      a: 'b',
      c: 1,
    }, {
      d: 'e',
      f: 2,
    }],
    object: {
      working: true,
      test: 'complete',
    },
  };

  it('should encode an object to a string', () =>
    expect(typeof encodeJSON(object)).toBe('string')
  );

  it('should encode to a string that can be decoded back', () =>
    expect(decodeJSON(encodeJSON(object))).toEqual(object)
  );

  it('should return undefined if incorrect JSON object', () =>
    expect(decodeJSON('INVALID_JSON')).toBeUndefined()
  );
});

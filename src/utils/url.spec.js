import { setQueryParam, setQueryParams, fixBaseUrl } from './url';

describe('set query param', () => {
  it('should set the query parameter', () => {
    expect(setQueryParam('?foo=bar', 'baz', 'qux')).toBe('?baz=qux&foo=bar');
  });

  it('should work with a full url', () => {
    expect(setQueryParam('http://test.com?foo=bar', 'baz', 'qux')).toBe('http://test.com?baz=qux&foo=bar');
  });

  it('should work with a url without query params', () => {
    expect(setQueryParam('http://test.com', 'baz', 'qux')).toBe('http://test.com?baz=qux');
  });
});

describe('set/update multiple query params', () => {
  it('should set and update the query parameter', () => {
    expect(setQueryParams('?foo=bar', { baz: 'qux', foo: 'no' })).toBe('?baz=qux&foo=no');
  });
});

describe('fixBaseUrl', () => {
  it('should add a slash to a bare baseUrl', () => {
    expect(fixBaseUrl('http://test.com')).toBe('http://test.com/');
  });
  it('should not add a slash to a good baseUrl', () => {
    expect(fixBaseUrl('http://test.com/')).toBe('http://test.com/');
  });
  it('should add a slash to a bare baseUrl with params', () => {
    expect(fixBaseUrl('http://test.com?baz=qux')).toBe('http://test.com/?baz=qux');
  });
  it('should not add a slash to a good baseUrl with params', () => {
    expect(fixBaseUrl('http://test.com/?baz=qux')).toBe('http://test.com/?baz=qux');
  });
  it('should not add a slash to a baseUrl with a path', () => {
    expect(fixBaseUrl('http://test.com/foo')).toBe('http://test.com/foo');
  });
  it('should not add a slash to a baseUrl with a path and params', () => {
    expect(fixBaseUrl('http://test.com/foo?baz=qux')).toBe('http://test.com/foo?baz=qux');
  });
  it('should add a slash to a baseUrl with a hyphen', () => {
    expect(fixBaseUrl('https://places-test.tippiq.rocks')).toBe('https://places-test.tippiq.rocks/');
  });
});

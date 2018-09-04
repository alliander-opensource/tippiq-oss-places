/**
 * Url util.
 * @module util/url
 */

import queryString from 'query-string';
import _ from 'lodash';

/**
 * Set query parameter.
 * @function setQueryParam
 * @param {string} url Url.
 * @param {string} key Param key to be set.
 * @param {string} value Param value to be set.
 * @returns {string} New url.
 */
export function setQueryParam(url, key, value) {
  const urlParts = url.split('?');
  const params = urlParts[1] ? queryString.parse(`?${urlParts[1]}`) : {};
  params[key] = value;
  return `${urlParts[0]}?${queryString.stringify(params)}`;
}

/**
 * Set query parameters.
 * @function setQueryParams
 * @param {string} url Url.
 * @param {Object} pairs Key values to set.
 * @returns {string} New url.
 */
export function setQueryParams(url, pairs) {
  let result = url;
  _.forOwn(pairs, (value, key) => {
    result = setQueryParam(result, key, value);
  });
  return result;
}

/**
 * Add '/' to the end if it is missing.
 * @param {string} url to fix
 * @returns {string} fixed url
 */
export function fixBaseUrl(url) {
  const brokenBaseUrl = /^(\w+:\/\/[-\w.:]*(?!\/))(\?.*)?$/;
  return brokenBaseUrl.test(url) ? url.replace(brokenBaseUrl, '$1/$2') : url;
}

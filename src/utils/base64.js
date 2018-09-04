/**
 * Base64 util.
 * @module util/base64
 */
import debugLogger from './debugnyan-poly';

const debug = debugLogger('tippiq-places:utils:base64');
/**
 * Encode an object into a base64 JSON string.
 * @function encodeJSON
 * @param {Object} object The object to be encoded.
 * @returns {string} The resulting base64 JSON string.
 */
export function encodeJSON(object) {
  const json = JSON.stringify(object);
  return new Buffer(json, 'utf8').toString('base64');
}

/**
 * Decode a base64 encoded JSON string into an object.
 * @function decodeJSON
 * @param {string} base64 Base64 encoded JSON string.
 * @returns {Object} The decoded object or undefined in case of decoding error.
 */
export function decodeJSON(base64) {
  let result;
  let utf8;

  try {
    utf8 = new Buffer(base64, 'base64').toString('utf8');
    result = JSON.parse(utf8);
  } catch (e) {
    debug.error(`Can not decode invalid JSON: ${utf8}`);
  }

  return result;
}

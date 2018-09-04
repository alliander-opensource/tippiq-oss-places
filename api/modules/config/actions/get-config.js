/**
 * Response handler for config/get-config.
 * @module modules/config/actions/get-config
 */

import config from './../../../config';

/**
 * Response handler for getting the config.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  res.json({
    tippiqIdBaseUrl: config.tippiqIdBaseUrl,
    frontendBaseUrl: config.frontendBaseUrl,
    landingBaseUrl: config.landingBaseUrl,
    privacyUrl: config.privacyUrl,
    tippiqAddressesBaseUrl: config.tippiqAddressesBaseUrl,
    locationAttributeType: config.locationAttributeType,
  });
}

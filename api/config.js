/**
 * Proxy module for frontend config.
 * @module config
 */

import _ from 'lodash';
import srcConfig from '../src/config';

const locationAttributeType = 'tippiq_Tippiq_place_tippiq_location';

const config = _.defaults(
  {
    databaseUrl: process.env.TIPPIQ_PLACES_DATABASE_URL,
    frontendBaseUrl: process.env.FRONTEND_BASE_URL,
    emailFrontendBaseUrl: process.env.EMAIL_FRONTEND_BASE_URL,
    tippiqIdPublicKey: process.env.TIPPIQ_ID_PUBLIC_KEY,
    tippiqHoodPublicKey: process.env.TIPPIQ_HOOD_PUBLIC_KEY,
    tippiqPlacesPrivateKey: process.env.TIPPIQ_PLACES_PRIVATE_KEY,
    jwtAudience: process.env.JWT_AUDIENCE,
    sessionSecret: process.env.CLIENT_SESSION_SECRET,
    oauth2CodeLength: process.env.OAUTH2_CODE_LENGTH,
    oauth2TokenLength: process.env.OAUTH2_TOKEN_LENGTH,
    tippiqIdBaseUrl: process.env.TIPPIQ_ID_BASE_URL,
    landingBaseUrl: process.env.LANDING_BASE_URL,
    keyLength: process.env.KEY_LENGTH,
    jwtIssuer: process.env.JWT_ISSUER,
    tippiqHoodJwtIssuer: process.env.TIPPIQ_HOOD_JWT_ISSUER,
    tippiqIdJwtIssuer: process.env.TIPPIQ_ID_JWT_ISSUER,
    tippiqIdAudience: process.env.TIPPIQ_ID_AUDIENCE,
    privacyUrl: process.env.PRIVACY_URL,
    tippiqAddressesBaseUrl: process.env.TIPPIQ_ADDRESSES_BASE_URL,
    debugKnexBindings: process.env.DEBUG_KNEX_BINDINGS,
  },
  {
    databaseUrl: 'postgresql://tippiq_places:tippiq_places@localhost:5432/tippiq_places?ssl=false',
    emailFromAddress: 'Tippiq Huis <noreply@tippiq.nl>',
    frontendBaseUrl: 'http://localhost:3010',
    emailFrontendBaseUrl: 'http://localhost:3001',
    tippiqIdPublicKey: `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEIwr0ttbt6S6lj3e8nuP3KN/clEw1RICw
k5d2Yy4hgKn7e6kBjeORFNnQDNj5GIGNmK0zb3SzW17JNzf22ooavQ==
-----END PUBLIC KEY-----`,
    tippiqHoodPublicKey: `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEvmC2rDsrwYWTRM++en5v8G+vZ29iWwH1
ZqzeFFvNJQKzY+vCdGI4RJgIYxmIqeCRCj1VI7gU8jGXOMNaAnfw0Q==
-----END PUBLIC KEY-----`,
    tippiqPlacesPrivateKey: `-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIA3AfB/8ewOQFAjWEoLbNsQ5QVnTihPEPyHvnrX006u7oAcGBSuBBAAK
oUQDQgAENqWoqfszSKmYzr7PFSDDMcx0sUfefHavWpzryi4kN15rvz5V81a0mCIg
xTJMWldn7gyb1IaDlD0wV6MJ79lTvA==
-----END EC PRIVATE KEY-----`,
    tippiqIdJwtIssuer: 'tippiq-id.local',
    tippiqHoodJwtIssuer: 'tippiq-hood.local',
    jwtAudience: 'tippiq-places.local',
    sessionSecret: 'Theyarepartoflotsofsessionsthatmakeupahazypartofmysessionlife.Jim Sullivan',
    oauth2CodeLength: 16,
    oauth2TokenLength: 255,
    tippiqIdBaseUrl: 'http://localhost:3001',
    landingBaseUrl: 'http://localhost:3010/styleguide?landing=1',
    keyLength: 1024,
    jwtIssuer: 'tippiq-places.local',
    tippiqIdAudience: 'tippiq-id.local',
    privacyUrl: 'https://www.tippiq.nl/privacy',
    tippiqAddressesBaseUrl: 'https://tippiq-test.tippiq.rocks',
    locationAttributeType,
    debugKnexBindings: false,
  },
  srcConfig
);

export default config;

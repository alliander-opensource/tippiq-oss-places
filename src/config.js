
/**
 * Environment object.
 * @constant environment
 * @type {Object}
 */
require('babel-polyfill');

const _ = require('lodash');

const environment = {
  development: {
    isProduction: false,
  },
  production: {
    isProduction: true,
  },
}[process.env.NODE_ENV || 'development'];

/**
 * Config object.
 * @constant
 * @type {Object}
 */
module.exports = _.defaults({},
  {
    host: process.env.HOST,
    port: process.env.PORT,
    apiHost: process.env.APIHOST,
    apiPort: process.env.APIPORT,
    healthKey: process.env.HEALTH_KEY,
  }, {
    host: 'localhost',
    port: '3010',
    apiHost: 'localhost',
    apiPort: '3012',
    healthKey: 'local',
  }, environment
);

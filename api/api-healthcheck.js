/**
 * @author Tippiq
 */
import BPromise from 'bluebird';
import healthcheck from 'healthcheck-middleware';
import { VError } from 'verror';
import debugLogger from 'debugnyan';
import axios from 'axios';

import { knex } from './common/bookshelf';
import { tippiqAddressesBaseUrl } from './config';

const logger = debugLogger('tippiq-places:healthcheck:api');

export default () => healthcheck({
  addChecks: (fail, pass) => {
    BPromise
      .all([
        knex.migrate.currentVersion()
          .then(version => ({ version, status: 'success' }))
          .catch(cause => new VError({ cause }, 'Knex Error')),
        BPromise
          .try(() => axios.get(`${tippiqAddressesBaseUrl}/api`, { timeout: 2000 }))
          .then(() => ({ status: 'success', critical: false }))
          .catch(error => ({ status: 'failure', error: `Addresses: ${error}`, critical: false })),
      ])
      .tapCatch(logger.error.bind(logger))
      .spread((database, addresses) => pass({
        database,
        addresses,
      }))
      .catch(fail);
  },
});

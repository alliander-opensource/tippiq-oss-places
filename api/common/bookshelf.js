/**
 * Bookshelf configuration.
 * @module common/bookshelf
 */

import bookshelf from 'bookshelf';
import knex from 'knex';
import bookshelfCascadeDelete from 'bookshelf-cascade-delete';
import debugLogger from 'debugnyan';
import { identity, omit } from 'lodash';

import { debugKnexBindings } from '../config';
import options from '../../knexfile';

const logger = debugLogger('tippiq-places:common:bookshelf');
const knexInstance = knex(options);

const prepareLogQueryObject = debugKnexBindings ? identity : query => ({ ...omit(query, 'bindings') });
knexInstance.on('query', query => {
  logger.debug(prepareLogQueryObject(query), query.sql);
});

const bookshelfInstance = bookshelf(knexInstance);

bookshelfInstance.plugin(bookshelfCascadeDelete);

export { knexInstance as knex };
export default bookshelfInstance;

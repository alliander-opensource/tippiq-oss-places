/**
 * PlaceRepository.
 * @module modules/places/repositories/place-repository
 */

import createKeys from 'rsa-json';
import BPromise from 'bluebird';
import debugLogger from 'debugnyan';

import { Place } from '../models';
import BaseRepository from '../../../common/base-repository';
import config from '../../../config';

const debug = debugLogger('tippiq-places:places:place-repository');

/**
 * A Repository for places.
 * @class PlaceRepository
 * @extends BaseRepository
 */
export class PlaceRepository extends BaseRepository {
  /**
   * Construct a PlaceRepository for Place.
   * @constructs PlaceRepository
   */
  constructor() {
    super(Place);
  }

  /**
   * Create a place with a private and public key pair.
   * @function createPlace
   * @param {Object} attributes An object containing key-value attributes of the Model.
   * @param {Object} options Bookshelf options to pass on to create.
   * @returns {Promise<Model>} A Promise that resolves to a new place model.
   */
  createPlace(attributes, options = {}) {
    debug.debug({ _function: 'create', attributes, options });
    const keyPairGenerator = BPromise.promisify(createKeys);
    return keyPairGenerator({ bits: config.keyLength })
      .then(pair =>
        ({
          private_key: pair.private,
          public_key: pair.public,
        }))
      .then(place => this.create(place))
      .tap(value =>
        debug.debug({ _function: 'create', value })
      )
      .catch((err) => {
        debug.debug({ _function: 'create', err });
        throw err;
      });
  }
}

export default new PlaceRepository();

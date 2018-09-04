import autobind from 'autobind-decorator';
import debugLogger from 'debugnyan';

@autobind
/**
 * Base repository that provides common actions for Bookshelf models.
 * @module common/base-repository
 */
export default class BaseRepository {
  /**
   * Create a BaseRepository for Model.
   * @constructs BaseRepository
   * @param {Object} Model that this Repository belongs to.
   */
  constructor(Model) {
    this.Model = Model;
    this.logger = debugLogger(`tippiq-places:repository:${this.constructor.name}`);
  }

  /**
   * Find all Models.
   * @function findAll
   * @param {Object|string} where Bookshelf key/operator/value or attributes hash.
   * @param {Object} options Bookshelf options to pass on to fetch.
   * @returns {Promise<Collection>} A Promise that resolves to a Collection of Models.
   */
  findAll(where = {}, options = {}) {
    return this.Model
      .where(where)
      .fetchAll(options);
  }

  /**
   * Find one Model.
   * @function findOne
   * @param {Object|string} where Bookshelf key/operator/value or attributes hash.
   * @param {Object} options Bookshelf options to pass on to fetch.
   * @returns {Promise<Model>} A Promise that resolves to a Model.
   */
  findOne(where, options = {}) {
    return this.Model
      .where(where)
      .fetch({
        ...options,
        require: true,
      });
  }

  /**
   * Find a Model by id.
   * @function findById
   * @param {string} id A uuid of a Model.
   * @param {Object} options Bookshelf options to pass on to findOne.
   * @returns {Promise<Model>} A Promise that resolves to a Model.
   */
  findById(id, options = {}) {
    return this.findOne({ id }, options);
  }

  /**
   * Create a new Model.
   * @function create
   * @param {Object} attributes An object containing key-value attributes of the Model.
   * @param {Object} options Bookshelf options to pass on to save.
   * @returns {Promise<Model>} A Promise that resolves to the created Model.
   */
  create(attributes, options = {}) {
    this.logger.debug({ _function: 'create', options });
    return new this.Model(attributes)
      .save(null, { ...options, method: 'insert' })
      .tap(({ id }) => {
        this.logger.debug({ _function: 'create', id });
      })
      .catch(err => {
        this.logger.debug({ _function: 'create', err });
        throw err;
      });
  }

  /**
   * Delete a Model by id.
   * @function deleteById
   * @param {string} id An object containing key-value attributes of the User.
   * @param {Object} options Bookshelf options to pass on to destroy.
   * @returns {Promise<Model>} A promise resolving to the destroyed
   * and thus "empty" Model.
   */
  deleteById(id, options = {}) {
    this.logger.debug({ _function: 'deleteById', id, options });
    return this.findById(id, options)
      .then(record => record.destroy(options));
  }

  /**
   * Delete Models by where clause.
   * @function deleteWhere
   * @param {Object} where An object containing key-value attributes of the where clause.
   * @param {Object} options Bookshelf options to pass on to destroy.
   * @returns {Promise<Model>} A promise resolving to the destroyed
   * and thus "empty" Model.
   */
  deleteWhere(where, options = {}) {
    this.logger.debug({ _function: 'deleteWhere', where, options });
    return this.findAll(where)
      .then(records => records.map(record => record.destroy(options)));
  }

  /**
   * Update a policy with specified id.
   * @function updateById
   * @param {string} id A uuid of the policy.
   * @param {Object} attributes An object containing key-value attributes of the Model.
   * @param {Object} options Bookshelf options to pass on to destroy.
   * @returns {Promise<Model>} A promise resolving to the updated Model.
   */
  updateById(id, attributes, options = {}) {
    this.logger.debug({ _function: 'updateById', id, options });
    return this.findById(id)
      .then((record) => {
        record.updateWith(attributes);
        return record.save(null, options);
      });
  }
}

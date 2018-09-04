/**
 * Search filter helper
 * @module modules/search-filter
 */

export const TYPE_MATCH_ONE = 'type_match_one';
export const TYPE_EXACT_MATCH = 'type_exact_match';
export const METHOD_WHERE = 'method_where';
export const METHOD_WHERE_IN = 'method_where_in';

/**
 * Search filter
 * @class SearchFilter
 */
export default class SearchFilter {
  /**
   * Construct a SearchFilter.
   * @param {String} column The column to apply the filter to
   * @param {String} value The value to search for
   * @param {String} type The type of search filter
   * @constructs SearchFilter
   */
  constructor(column, value, type) {
    this.column = column;
    this.value = value;
    this.type = type;
  }

  /**
   * Get the query options for the search filter
   * @function getQuery
   * @returns {Array.<Object>} A list with the objects containing the query options.
   */
  getQuery() {
    switch (this.type) {
      case TYPE_EXACT_MATCH:
        return [this.equalFilter(this.column, this.value)];

      case TYPE_MATCH_ONE:
        return [this.matchOneFilter(this.column, this.value)];

      default:
        return [];
    }
  }

  /**
   * Private helper function to generate the match one filter
   * @function matchOneFilter
   * @param {String} column The column to apply the filter to
   * @param {String} value The value to search for
   * @returns {Object} The object containing the query options.
   */
  matchOneFilter(column, value) {
    if (typeof value === 'undefined') {
      return null;
    }

    return {
      column,
      value,
      method: METHOD_WHERE_IN,
    };
  }

  /**
   * Private helper function to generate the match equal filter
   * @function equalFilter
   * @param {String} column The column to apply the filter to
   * @param {String} value The value to search for
   * @returns {Object} The object containing the query options.
   */
  equalFilter(column, value) {
    if (typeof value === 'undefined') {
      return null;
    }

    return {
      column,
      value,
      operator: '=',
      method: METHOD_WHERE,
    };
  }
}

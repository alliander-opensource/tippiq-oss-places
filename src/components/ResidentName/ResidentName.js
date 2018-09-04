/**
 * ResidentName.
 * @module components/ResidentName
 */

import React, { PropTypes } from 'react';
import { truncate } from 'lodash';

/**
 * ResidentName
 * @function ResidentName
 * @param {Function} props.action Set Cookie.
 * @param {string} props.privacyUrl Url to privacy statement.
 * @returns {string} Markup of the not found page.
 */
const ResidentName = ({ text, truncateAt = 20, classNameText = '', children = ([]) }) => (
  <span className={classNameText}>
    { truncate(text || 'Bewoner', { length: truncateAt, separator: '..' }) }
    {children}
  </span>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
ResidentName.propTypes = {
  text: PropTypes.string,
  truncateAt: PropTypes.number,
  classNameText: PropTypes.string,
  children: PropTypes.object,
};

export default ResidentName;

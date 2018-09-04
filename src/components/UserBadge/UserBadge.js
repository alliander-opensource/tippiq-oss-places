/**
 * UserBadge component.
 * @module components/UserBadge
 */

import React, { PropTypes } from 'react';

import styles from './UserBadge.scss';

/**
 * UserBadge component.
 * @function UserBadge
 * @param {string} props.username Label of the field.
 * @returns {string} Markup of the component.
 */

/**
 * UserBadge component class.
 * @function Field
 * @param {string} props.username Username to show.
 * @param {string} props.failureUri Failure URI.
 * @param {string} props.className Classname(s) to apply.
 * @returns {string} Markup of the component.
 */
const UserBadge = ({ username, failureUri, className }) => {
  const decodedFailureUri = decodeURIComponent(failureUri);

  return (
    <div className={className}>
      <div id="user-badge" className={styles.container}>
        <p className="clearfix">
          <span id="email" className={styles.email}>{username}</span>&nbsp;
          <a
            href={decodedFailureUri} target="_parent" id="switch-link"
            className={`btn btn-default pull-right ${styles.button}`}
          >
            Ander account
          </a>
        </p>
      </div>
    </div>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
UserBadge.propTypes = {
  username: PropTypes.string.isRequired,
  failureUri: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

export default UserBadge;

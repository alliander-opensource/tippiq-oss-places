/**
 * Residents component.
 * @module components/Residents
 */

import React, { PropTypes } from 'react';
import styles from './Residents.scss';
import { ResidentName } from '../../components';

/**
 * Residents component class.
 * @function Residents
 * @param {array} props.residents List of residents.
 * @returns {string} Markup of the component.
 */
const Residents = ({ items, userId }) =>
  <div className={`${styles.container} container row ${styles.content}`}>
    <div className={`${styles.panel} panel panel-default`}>
      <div className={styles.tableHead}>
        <div className={styles.tableRow}>
          <span className={styles.rowTitle}>Naam</span>
        </div>
        <div className={styles.tableRow}>
          <span className={styles.rowTitle}>Rol</span>
        </div>
        <div className={styles.tableRow} />
      </div>
      <div className={styles.tableBody}>
        {items.list.map((resident, i) =>
          <div className={styles.tableColumn} key={i}>
            <div className={styles.tableRow}>
              <ResidentName
                text={resident.displayName}
                truncateAt={50}
                classNameText={styles.name}
              />
              { userId && userId === resident.tippiqId &&
                <span className={styles.you}>(jij)</span>
              }
            </div>
            <div className={styles.tableRow}>{(() => {
              switch (resident.role) {
                case 'place_admin':
                  return 'Hoofdbewoner';
                default:
                  return 'Bewoner';
              }
            })()}
            </div>
            <div className={styles.tableRow}>
              <button className={`${styles.styleLessButton} ${styles.editButton}`}>Bewerken</button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>;

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Residents.propTypes = {
  items: PropTypes.object.isRequired,
  userId: PropTypes.string,
};

export default Residents;

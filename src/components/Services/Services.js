/**
 * Services component.
 * @module components/Services
 */

import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Row, Col } from 'react-bootstrap';
import ServiceItem from './ServiceItem';
import styles from './Services.css';

/**
 * Services component class.
 * @function Services
 * @param {array} props.services List of services.
 * @returns {string} Markup of the component.
 */
const Services = ({
  items,
  placeId,
  itemsAreActiveServices,
  numberOfItemsPerRow,
  fillRowWithBlankItemsIfNeeded,
  showActionButton,
}) => {
  const serviceItems = items.list;
  let numberOfBlankItems = 0;
  if (numberOfItemsPerRow && fillRowWithBlankItemsIfNeeded) {
    const rest = serviceItems.length % numberOfItemsPerRow;
    numberOfBlankItems = numberOfItemsPerRow - rest;
  }
  return (
    <Row>
      <Col md={12} className={styles.bottomMargin}>
        <div className={styles.serviceContainer}>
          {(serviceItems.length === 0) &&
            <div className="col col-xs-12 col-md-12">
              <p>Je hebt nog geen actieve diensten.</p>
              {showActionButton &&
                <Link className="btn btn-primary" to={`/huis/${placeId}/diensten`}>
                  Ga naar het dienstenoverzicht
                </Link>
              }
            </div>
          }
          {serviceItems.map((serviceItem, i) =>
            <ServiceItem
              serviceItem={serviceItem}
              itemIsActiveService={itemsAreActiveServices}
              placeId={placeId}
              key={i}
            />
          )}
          {numberOfBlankItems !== numberOfItemsPerRow
          && _.range(numberOfBlankItems).map((blankItem, i) =>
            <div className={styles.serviceItemPlaceholder} key={`blank-${i}`} />
          )}
        </div>
      </Col>
    </Row>);
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Services.propTypes = {
  items: PropTypes.object.isRequired,
  itemsAreActiveServices: PropTypes.bool,
  placeId: PropTypes.string.isRequired,
  numberOfItemsPerRow: PropTypes.number,
  fillRowWithBlankItemsIfNeeded: PropTypes.bool,
  showActionButton: PropTypes.bool,
};

export default Services;

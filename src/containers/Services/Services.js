/**
 * Services container.
 * @module containers/Services
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { Services as ServicesComponent } from '../../components';
import styles from './Services.css';

import { SUCCESS } from '../../constants/status';
import {
  getServices,
  getAllServices,
} from '../../actions';

@connect(
  state => ({
    services: state.services,
    allServices: state.allServices,
  }),
  dispatch => bindActionCreators({
    getServices,
    getAllServices,
  }, dispatch),
)
/**
 * Services Container class.
 * @class Services
 * @extends Component
 */
export default class Services extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    services: PropTypes.object.isRequired,
    allServices: PropTypes.object.isRequired,
    params: PropTypes.object,
    getServices: PropTypes.func.isRequired,
    getAllServices: PropTypes.func.isRequired,
  };

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getServices(this.props.params.placeId);
    this.props.getAllServices(this.props.params.placeId);
  }

  /**
   * Services component.
   * @function render
   * @returns {string} Markup of the services screen.
   */
  render() {
    const { services, allServices, params } = this.props;
    return (
      <div id="page-services">
        <Helmet title="Diensten" />
        <Grid>
          <Row>
            <Col xs={12}>
              <h1 className={styles.pageHeader}>Dienstenoverzicht</h1>
            </Col>
          </Row>
        </Grid>
        {
          services.list && services.status === SUCCESS &&
            <Grid>
              <Row>
                <Col xs={12}>
                  <hr className={styles.ruler} />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <h3 className={styles.sectionHeader}>Geactiveerde diensten</h3>
                </Col>
              </Row>
              <ServicesComponent placeId={params.placeId} items={services} itemsAreActiveServices />
            </Grid>
        }
        {
          allServices.list && allServices.status === SUCCESS &&
            <Grid className={styles.lastSection}>
              <Row>
                <Col xs={12}>
                  <hr className={styles.ruler} />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <h3 className={styles.sectionHeader}>Beschikbare diensten</h3>
                </Col>
              </Row>
              <ServicesComponent placeId={params.placeId} items={allServices} />
            </Grid>
        }
      </div>
    );
  }
}

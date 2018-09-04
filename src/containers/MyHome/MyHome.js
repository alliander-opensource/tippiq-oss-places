/**
 * MyHome container.
 * @module containers/MyHome
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import {
  Residents as ResidentsComponent,
  Services as ServicesComponent,
  Location as LocationComponent,
} from '../../components';
import styles from './MyHome.css';

import { SUCCESS } from '../../constants/status';
import {
  getPlaceLocation,
  getResidents,
  getServices,
} from '../../actions';

@connect(
  state => ({
    placeLocation: state.placeLocation,
    residents: state.residents,
    services: state.services,
    userId: state.user.userId,
  }),
  dispatch => bindActionCreators({
    getPlaceLocation,
    getResidents,
    getServices,
  }, dispatch),
)
/**
 * MyHome Container class.
 * @class MyHome
 * @extends Component
 */
export default class MyHome extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    location: PropTypes.shape(),
    placeLocation: PropTypes.shape().isRequired,
    params: PropTypes.shape({
      placeId: PropTypes.string,
    }),
    getPlaceLocation: PropTypes.func.isRequired,
    residents: PropTypes.shape().isRequired,
    userId: PropTypes.string,
    getResidents: PropTypes.func.isRequired,
    services: PropTypes.shape().isRequired,
    getServices: PropTypes.func.isRequired,
  };

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getPlaceLocation(this.props.params.placeId);
    this.props.getResidents(this.props.params.placeId);
    this.props.getServices(this.props.params.placeId);
  }

  /**
   * Render method
   * @function render
   * @returns {string} Markup of the container.
   */
  render() {
    const { placeLocation, residents, services, params, userId } = this.props;
    const linkToServicesOverview = `/huis/${this.props.params.placeId}/diensten`;
    return (
      <div id="page-my-house">
        <Helmet title="Mijn huis" />
        { placeLocation.placeId && (
            placeLocation.status === SUCCESS ?
              <LocationComponent placeLocation={placeLocation} /> :
              <LocationComponent />
          )
        }
        {
          residents.list && residents.status === SUCCESS &&
            <Grid>
              <Row>
                <Col md={6} sm={6}><h3>Bewoners</h3></Col>
              </Row>
              <ResidentsComponent items={residents} userId={userId} />
            </Grid>
        }
        {
          services.list && services.status === SUCCESS &&
            <Grid>
              <Row>
                <Col md={6} sm={6}><h3>Diensten en huisregels</h3></Col>
                <Col
                  md={6}
                  sm={6}
                  className={`visible-sm-block visible-md-block visible-lg-block ${styles.topMargin}`}
                >
                  <Link to={linkToServicesOverview} className="btn btn-link pull-right text-uppercase">Naar Dienstenoverzicht</Link>
                </Col>
              </Row>
              <ServicesComponent
                items={services}
                placeId={params.placeId}
                numberOfItemsPerRow={4}
                fillRowWithBlankItemsIfNeeded
                itemsAreActiveServices
                showActionButton
              />
              <Row>
                <Col xs={12} className={`visible-xs-block text-center ${styles.bottomMargin}`}>
                  <Link to={linkToServicesOverview} className="btn btn-link text-center text-uppercase">Naar Dienstenoverzicht</Link>
                </Col>
              </Row>
            </Grid>
        }
      </div>
    );
  }
}

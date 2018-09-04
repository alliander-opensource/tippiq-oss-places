/**
 * View Policies container.
 * @module containers/Policies/ViewPolicies
 */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Grid, Row } from 'react-bootstrap';

import {
  getPolicies,
  getServiceProvider,
} from '../../actions';

import styles from './ViewPolicies.css';

@connect(
  state => ({
    policies: state.policies,
    serviceProvider: state.serviceProvider,
  }),
  dispatch => bindActionCreators({
    getPolicies,
    getServiceProvider,
  }, dispatch),
)
/**
 * ViewPolicies container class.
 * @class ViewPolicies
 * @extends Component
 */
export default class ViewPolicies extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getPolicies: PropTypes.func.isRequired,
    getServiceProvider: PropTypes.func.isRequired,
    policies: PropTypes.object,
    serviceProvider: PropTypes.object,
    params: PropTypes.object,
  };

  /**
   * Policies component.
   * @function componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    const { placeId, serviceProviderId } = this.props.params;
    this.props.getPolicies(serviceProviderId, placeId);
    this.props.getServiceProvider(serviceProviderId);
  }

  /**
   * Policies component.
   * @function render
   * @returns {string} Markup of the manage screen.
   */
  render() {
    const { serviceProvider } = this.props;
    return this.props.policies.list && (
      <div id="page-view-policies">
        <Helmet title="Huisregels bekijken" />
        <Grid>
          <Row>
            <Col sm={12}>
              <div className="container">
                <div className="back">
                  <i className="fa fa-angle-left" aria-hidden="true" /> <Link to={`/huis/${this.props.params.placeId}/mijn-huis`}>Terug naar overzicht</Link>
                </div>
                {serviceProvider &&
                  <h1 className={styles.header}>
                    <a className={`btn btn-default pull-right ${styles.headerButton}`} href={serviceProvider.content.serviceLink} target="_blank" rel="noopener noreferrer">Naar {serviceProvider.name}</a>
                    <img
                      className="serviceLogo"
                      src={`data:image/png;base64,${serviceProvider.logo}`}
                      alt={serviceProvider.name}
                    />
                    {serviceProvider.name}
                  </h1>
                }
                <div className={`panel panel-default borderless ${styles.panel}`}>
                  <ul className="list-group">
                    <li className="list-group-item header">
                      <Link className={`btn btn-default pull-right ${styles.editButton}`} to={`/huis/${this.props.params.placeId}/${this.props.params.serviceProviderId}/huisregels/wijzigen`}>Wijzigen</Link>
                      <h2>Huisregels</h2>
                    </li>
                    {this.props.policies.list.map((policy, i) =>
                      <li key={i} className="list-group-item checked policy">
                        {policy.title}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>);
  }
}

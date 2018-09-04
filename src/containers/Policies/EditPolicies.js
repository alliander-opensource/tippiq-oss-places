/**
 * Edit Policies container.
 * @module containers/Policies/EditPolicies
 */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Grid, Row } from 'react-bootstrap';

import { EditPolicyForm } from '../../components';
import { PENDING, SUCCESS } from '../../constants/status';

import {
  getPolicies,
  getServiceProvider,
  setPolicies,
} from '../../actions';

import styles from './EditPolicies.css';

@connect(
  state => ({
    policies: state.policies,
    serviceProvider: state.serviceProvider,
  }),
  dispatch => bindActionCreators({
    getPolicies,
    getServiceProvider,
    setPolicies,
  }, dispatch),
)
/**
 * EditPolicies container class.
 * @class EditPolicies
 * @extends Component
 */
export default class EditPolicies extends Component {

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
    setPolicies: PropTypes.func.isRequired,
    params: PropTypes.object,
  };

  /**
   * Constructor
   * @method constructor
   * @returns {undefined}
   */
  constructor() {
    super();
    this.submitForm = this.submitForm.bind(this);
    this.closeSaved = this.closeSaved.bind(this);
    this.state = {
      saved: false,
    };
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    const { placeId, serviceProviderId } = this.props.params;
    this.props.getPolicies(serviceProviderId, placeId);
    this.props.getServiceProvider(serviceProviderId);
  }

  /**
   * componentWillReceiveProps
   * @param {Object} nextProps The next props
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.policies.save.status === PENDING && nextProps.policies.save.status === SUCCESS) {
      this.setState({
        saved: true,
      });
    }
  }

  /**
   * Close saved message.
   * @function closeSaved
   * @returns {undefined}
   */
  closeSaved() {
    this.setState({
      saved: false,
    });
  }

  /**
   * Submit form handler.
   * @function submitForm
   * @param {Object} data Data
   * @returns {undefined}
   */
  submitForm(data) {
    const selectedPolicies = Object.keys(data).filter(key => data[key] === true);
    const policiesObjectList = this.props.policies.list
      .map(policy => ({
        enabled: selectedPolicies.indexOf(policy.templateSlug) !== -1,
        ...policy,
      }));
    this.props.setPolicies(
      policiesObjectList,
      this.props.params.serviceProviderId,
      this.props.params.placeId
    );
  }

  /**
   * Policies component.
   * @function render
   * @returns {string} Markup of the manage screen.
   */
  render() {
    const { serviceProvider, policies, params } = this.props;
    const initialValues = policies.list ?
      policies.list
        .reduce((hash, policy) =>
          Object.assign(hash, { [policy.templateSlug]: true }), {}) : {};
    const viewLink = `/huis/${params.placeId}/${params.serviceProviderId}/huisregels`;
    return policies.list && (
      <div id="page-edit-policies">
        <Helmet title="Huisregels wijzigen" />
        {this.state.saved &&
          <div className={styles.alert}>
            <Grid>
              <button
                type="button"
                className={styles.close}
                aria-hidden="true"
                onClick={this.closeSaved}
                tabIndex="-1"
              >×</button>
              Aanpassingen opgeslagen!
            </Grid>
          </div>
        }
        <Grid>
          <Row>
            <Col sm={12}>
              <div className="container">
                <div className="back">
                  <i className="fa fa-angle-left" aria-hidden="true" /> <Link to={viewLink}>Terug naar {serviceProvider.name}</Link>
                </div>
                {serviceProvider &&
                  <h1 className={styles.header}>
                    Huisregels voor{' '}
                    <img
                      className={`serviceLogo ${styles.serviceLogo}`}
                      src={`data:image/png;base64,${serviceProvider.logo}`}
                      alt={serviceProvider.name}
                    />
                  </h1>
                }
                <EditPolicyForm
                  initialValues={initialValues}
                  onSubmit={this.submitForm}
                  cancelLink={viewLink}
                  fields={policies.list.map(policy => policy.templateSlug)}
                  policies={policies.list}
                />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>);
  }
}

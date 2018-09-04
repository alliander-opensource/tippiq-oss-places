/**
 * Manage container.
 * @module containers/Consent
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { Col, Grid, Row } from 'react-bootstrap';

import { SUCCESS } from '../../constants/status';
import { ServiceProviderBanner, PolicyForm } from '../../components';
import {
  getPolicyTemplates,
  setPolicies,
  authorize,
  giveConsent,
  getPolicies,
  setSession,
} from '../../actions';
import { setQueryParam, setQueryParams } from '../../utils/url';
import { decodeJSON } from '../../utils/base64';

import styles from './ManagePolicies.scss';

@connect(
  state => ({
    appConfig: state.appConfig,
    authorization: state.authorization,
    consent: state.consent,
    policies: state.policies,
    user: state.user,
  }),
  dispatch => bindActionCreators({
    authorize,
    giveConsent,
    getPolicyTemplates,
    setPolicies,
    getPolicies,
    setSession,
  }, dispatch),
)
/**
 * ManagePolicies component class.
 * @class ManagePolicies
 * @extends Component
 */
export default class ManagePolicies extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    appConfig: PropTypes.shape({
      frontendBaseUrl: PropTypes.string,
      tippiqIdBaseUrl: PropTypes.string,
    }),
    authorize: PropTypes.func.isRequired,
    giveConsent: PropTypes.func.isRequired,
    getPolicyTemplates: PropTypes.func.isRequired,
    setPolicies: PropTypes.func.isRequired,
    getPolicies: PropTypes.func.isRequired,
    policyTemplates: PropTypes.object,
    location: PropTypes.object,
    authorization: PropTypes.object,
    consent: PropTypes.object,
    policies: PropTypes.object,
    params: PropTypes.object,
    user: PropTypes.object,
  };

  /**
   * Constructor
   * @method constructor
   * @returns {undefined}
   */
  constructor() {
    super();
    this.submitForm = this.submitForm.bind(this);
  }

  /**
   * Policies component.
   * @function componentDidMount
   * @returns {undefined}
   */
  componentDidMount() { // eslint-disable-line complexity
    const { clientId, response_type: responseType } = this.props.location.query;
    const { token } = this.props.user;
    const { placeId } = this.props.params;
    if (!clientId || !placeId) return;

    if (!token || !this.props.user.placeId) {
      // We also need to request a new session if we have a token without placeId
      this.getUserSession();
    } else if (responseType) {
      this.authorizeRequest();
    } else {
      // todo: Make sure clientId is not spoofed, maybe by signing the request

      const policiesRequest = decodeJSON(this.props.location.query.policiesRequest);
      const policies = _.flatMap(policiesRequest, (policySet) => policySet.policies);
      this.props.getPolicyTemplates(clientId, policies);
      this.props.getPolicies(clientId, placeId);
    }
  }

  /**
   * Component will receive props life cycle method.
   * @function componentWillReceiveProps
   * @param {Object} nextProps Property bag.
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    const { query } = this.props.location;
    const { clientId } = query;
    if (this.props.authorization.status !== SUCCESS &&
      nextProps.authorization.status === SUCCESS) {
      const { placeId } = this.props.params;
      const policiesRequest = decodeJSON(query.policiesRequest);
      const policies = _.flatMap(policiesRequest, (policySet) => policySet.policies);
      this.props.getPolicyTemplates(clientId, policies);
      this.props.getPolicies(clientId, placeId);
    }
    if (!this.props.consent.authorizationCode && nextProps.consent.authorizationCode) {
      this.submitPolicies();
    }
    if (nextProps.policies.save.status === SUCCESS) {
      const { placeId } = this.props.params;
      window.location.href = `/api/redirect/?clientId=${clientId}&uri=${encodeURIComponent(
        this.createRedirectUrl(
          query,
          this.props.consent.authorizationCode,
          placeId
        ))}`;
    }
  }

  /**
   * Redirect to User session retrieval
   * @function getUserSession
   * @returns {undefined}
   */
  getUserSession() {
    const { frontendBaseUrl, tippiqIdBaseUrl } = this.props.appConfig;
    const {
      clientId,
      policiesRequest,
      response_type: responseType,
      redirect_uri: redirectUri,
      failure_uri: failureUri,
      scope,
      state,
    } = this.props.location.query;
    const { placeId } = this.props.params;

    const redirectUrl = setQueryParams(`${frontendBaseUrl}/huis/${placeId}/huisregels`, {
      policiesRequest,
      clientId,
      scope,
      state,
      response_type: responseType,
      redirect_uri: redirectUri,
      failure_uri: failureUri,
    });
    let getSessionUrl = `${tippiqIdBaseUrl}/get-session?audience=places&place_id=${placeId}`;
    getSessionUrl = setQueryParam(getSessionUrl, 'redirect_uri', encodeURIComponent(redirectUrl));
    window.location.href = getSessionUrl;
  }

  /**
   * Creates the redirect url
   * @param {object} query The query object
   * @param {string} authorizationCode The authorization code
   * @returns {string} The redirect url
   */
  createRedirectUrl(query, authorizationCode, placeId) {
    const { response_type: responseType, redirect_uri: redirectUri } = query;
    let redirectUrl = decodeURIComponent(redirectUri);
    if (responseType === 'code') {
      redirectUrl = setQueryParam(redirectUrl, 'code', authorizationCode);
      redirectUrl = setQueryParam(redirectUrl, 'place', placeId);
    }
    return redirectUrl;
  }

  /**
   * Authorize request
   * @function authorizeRequest
   * @returns {undefined}
   */
  authorizeRequest() {
    const {
      clientId,
      response_type: responseType,
      redirect_uri: redirectUri,
      scope,
      state,
    } = this.props.location.query;
    this.props.authorize({
      clientId,
      redirectUri,
      responseType,
      scope,
      state,
    });
  }

  /**
   * Submit form handler.
   * @function submitForm
   * @param {Object} data Data
   * @returns {undefined}
   */
  submitForm(data) {
    const { response_type: responseType } = this.props.location.query;
    const { token } = this.props.user;
    if (!responseType) { // consent already given
      this.submitPolicies(Object.keys(data).filter(key => data[key] === true));
    } else if (token) {
      this.setState({
        submittedPolicies: Object.keys(data).filter(key => data[key] === true),
      });
      const accept = true;
      this.props.giveConsent(accept, this.props.authorization.transactionId);
    }
  }

  /**
   * Submit policies.
   * @function submitPolicies
   * @param {Array} submittedPolicies Submitted policies
   * @returns {undefined}
   */
  submitPolicies(submittedPolicies) {
    const policies = submittedPolicies || this.state.submittedPolicies;
    const { clientId } = this.props.location.query;
    const { userId } = this.props.user;
    const { placeId } = this.props.params;

    const policiesObjectList = this.props.policies.templates.list
      .map(policyTemplate => {
        const template = Object.assign({}, policyTemplate);
        template.serviceProviderId = clientId;
        template.userId = userId;
        template.templateSlug = template.slug;
        template.enabled = policies.indexOf(template.templateSlug) !== -1;
        delete template.slug;
        delete template.id;

        return template;
      });
    this.props.setPolicies(policiesObjectList, clientId, placeId);
  }

  /**
   * Policies component.
   * @function render
   * @returns {string} Markup of the manage screen.
   */
  render() {
    const { policies, authorization, location } = this.props;
    const { clientId } = location.query;
    const policiesRequest = decodeJSON(location.query.policiesRequest);
    const initialValues = policies.list ?
      policies.list
        .reduce((hash, policy) =>
          Object.assign(hash, { [policy.templateSlug]: true }), {}) : {};

    return policies.templates.list && policies.list && (
      <div id="page-manage-policies">
        <Helmet title="Huisregels beheren" />
        <ServiceProviderBanner serviceProviderId={clientId} />
        <Grid className={styles.wrapper}>
          <Row>
            <Col sm={12}>
              <div className={styles.content}>
                <h1>Je huisregels</h1>
                <br />
                <PolicyForm
                  initialValues={initialValues}
                  isSetup={authorization.status === SUCCESS}
                  onSubmit={this.submitForm}
                  fields={policies.templates.list.map(template => template.slug)}
                  policiesRequest={policiesRequest}
                  policies={policies.templates.list}
                  clientId={clientId}
                />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>);
  }
}

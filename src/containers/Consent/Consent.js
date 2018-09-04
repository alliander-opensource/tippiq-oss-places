/**
 * Consent container.
 * @module containers/Consent
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import storage from 'store2';

import { authorize, giveConsent } from '../../actions';
import styles from './Consent.scss';

@connect(
  state => ({
    authorization: state.authorization,
    consent: state.consent,
    user: state.user,
    clientId: state.authorization.clientName,
  }),
  dispatch => bindActionCreators({ authorize, giveConsent }, dispatch),
)
/**
 * Consent component class.
 * @class Consent
 * @extends Component
 */
export default class Consent extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    authorize: PropTypes.func.isRequired,
    giveConsent: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    authorization: PropTypes.object,
    consent: PropTypes.object.isRequired,
    user: PropTypes.object,
    clientId: PropTypes.string,
  };

  /**
   * Constructor
   * @method constructor
   * @returns {undefined}
   */
  constructor() {
    super();
    this.handleConsent = this.handleConsent.bind(this);
  }

  /**
   * Authorize component.
   * @function componentDidMount
   * @description immediately stores oauth2 values and redirects to tippiqId get-session.
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.authorize(this.getAuthorizationRequest());
  }

  /**
   * Consent component.
   * @function componentWillReceiveProps
   * @param {Object} nextProps Updated state.
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    const { authorizationCode, error, clientId } = nextProps.consent;
    if (authorizationCode) {
      const authRequest = this.getAuthorizationRequest();
      const state = authRequest.state ? `state=${authRequest.state}&` : '';
      const url = `${authRequest.redirectUri}?${state}`;
      if (authorizationCode) {
        const uri = encodeURIComponent(`${url}code=${authorizationCode}`);
        window.location.href = `/api/redirect/?clientId=${clientId}&uri=${uri}`;
      }
      if (error) {
        window.location.href = `${url}error=${error}`;
      }
    }
  }

  /**
   * Consent component.
   * @function getAuthorizationRequest
   * @returns {Object} Authorization request object.
   */
  getAuthorizationRequest = () =>
    (storage.has('authorizationRequest') ? storage('authorizationRequest') : {});

  /**
   * Consent request and redirect with consent token.
   * @function handleConsent
   * @returns {undefined}
   */
  handleConsent() {
    const accept = true;
    const { token } = this.props.user;
    const { transactionId } = this.props.authorization;
    if (token) {
      this.props.giveConsent(accept, transactionId);
    }
  }

  /**
   * Consent component.
   * @function render
   * @returns {string} Markup of the consent screen.
   */
  render() {
    const { clientName } = this.props.authorization;

    return (
      <div id="page-consent" className={styles.consent}>
        <Helmet title="Huisregels instellen" />
        <div className="container">
          <h1>Je gaat nu je huisregels instellen op Tippiq</h1>
          <p>{clientName} wil toegang tot jouw gegevens</p>
          <ul className="list-inline">
            <li>
              <button
                className="btn btn-success" id="handleConsentButton"
                onClick={this.handleConsent}
              >Ik geef toestemming
              </button>
            </li>
            <li>
              <button
                className="btn btn-danger disabled" id="rejectConsentButton"
              >
                Nee, ik wil dit niet.
              </button>
            </li>
          </ul>
        </div>
      </div>);
  }
}

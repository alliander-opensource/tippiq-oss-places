/**
 * Authorize container stores oauth2 values and redirects to tippiqId get-session.
 * @module containers/Authorize
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import storage from 'store2';

@connect(
  state => ({
    appConfig: state.appConfig,
  }),
)
/**
 * Authorize component class.
 * @class Authorize
 * @extends Component
 */
export default class Authorize extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    location: PropTypes.shape({
      query: PropTypes.string,
    }),
    appConfig: PropTypes.shape({
      frontendBaseUrl: PropTypes.string,
      tippiqIdBaseUrl: PropTypes.string,
    }),
  };

  /**
   * Authorize component.
   * @function componentDidMount
   * @description immediatly stores oauth2 values and redirects to tippiqId get-session.
   * @returns {undefined}
   */
  componentDidMount() {
    const { frontendBaseUrl, tippiqIdBaseUrl } = this.props.appConfig;
    const { client_id: clientId, redirect_uri: redirectUri, response_type: responseType, scope,
      state } = this.props.location.query;

    storage.set('authorizationRequest',
      { clientId, redirectUri, responseType, scope, state });

    const redirectUrl = encodeURIComponent(`${frontendBaseUrl}/consent`);
    window.location.href =
      `${tippiqIdBaseUrl}/get-session?redirect_uri=${redirectUrl}`;
  }

  /**
   * Authorize component.
   * @function render
   * @returns {string} null
   */
  render() {
    return null;
  }
}

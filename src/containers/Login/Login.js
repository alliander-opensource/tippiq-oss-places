/**
 * Login complete container.
 * @module containers/Login/LoginComplete
 */
import { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { setSession } from '../../actions';

@connect(
  state => ({
    tippiqIdBaseUrl: state.appConfig.tippiqIdBaseUrl,
    frontendBaseUrl: state.appConfig.frontendBaseUrl,
    user: state.user,
  }), ({
    setSession,
  })
)
/**
 * Login complete component class.
 * @class LoginComplete
 * @extends Component
 */
export default class Login extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    setSession: PropTypes.func.isRequired,
    tippiqIdBaseUrl: PropTypes.string,
    frontendBaseUrl: PropTypes.string,
    user: PropTypes.shape({
      placeId: PropTypes.string,
      token: PropTypes.string,
    }),
    location: PropTypes.shape({
      query: PropTypes.shape({
        placeId: PropTypes.string,
        redirect_uri: PropTypes.string,
      }),
    }),
  };

  /**
   * On component will mount
   * @function componentWillMount
   * @returns {undefined}
   */
  componentWillMount() {
    if (__CLIENT__) {
      const { redirect_uri: redirectUri } = this.props.location.query;

      if (!this.props.user.token) {
        window.location.href = this.getTippiqIdSelectPlaceUrl(redirectUri);
      } else {
        this.redirect(this.props);
      }
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    this.redirect(nextProps);
  }

  /**
   * Build url to let the user select a place at Tippiq ID
   * @method getTippiqIdSelectPlaceUrl
   * @param {string} redirectUri Route to load upon login completion
   * @param {Object} nextProps Property bag.
   * @returns {string} URL to select a place at tippiq
   */
  getTippiqIdSelectPlaceUrl(redirectUri) {
    const { tippiqIdBaseUrl, frontendBaseUrl } = this.props;
    const returnUrl = redirectUri ? `?redirect_uri=${redirectUri}` : '';
    const tippiqIdRedirectUrl = encodeURIComponent(`${frontendBaseUrl}/login${returnUrl}`);
    return `${tippiqIdBaseUrl}/selecteer-je-huis?audience=places&redirect_uri=${tippiqIdRedirectUrl}`;
  }

  /**
   * When the placeId has loaded, redirect to the requested redirectUri or the my place page.
   * @method redirect
   * @param {Object} props Properties map
   * @returns {undefined}
   */
  redirect(props) {
    const { placeId } = props.user;
    const { redirect_uri: redirectUri } = props.location.query;
    if (placeId) {
      if (redirectUri) {
        browserHistory.push(redirectUri);
      } else {
        browserHistory.push(`/huis/${placeId}/mijn-huis`);
      }
    }
  }

  /**
   * Create markup.
   * @function render
   * @returns {string} Markup of the LoginComplete screen.
   */
  render() {
    return null;
  }
}

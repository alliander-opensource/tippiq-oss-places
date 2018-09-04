/**
 * Header container.
 * @module containers/Header
 */

import { compact } from 'lodash';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, withRouter } from 'react-router';
import { bindActionCreators } from 'redux';

import {
  getDisplayName,
  getPlaceLocation,
  logout,
} from '../../actions';
import { NavBar } from '../../components';
import { IDLE, SUCCESS } from '../../constants/status';

@withRouter
@connect(
  (state) => ({
    displayName: state.displayName,
    tippiqIdBaseUrl: state.appConfig.tippiqIdBaseUrl,
    frontendBaseUrl: state.appConfig.frontendBaseUrl,
    placeLocation: state.placeLocation,
    user: state.user,
  }),
  dispatch => bindActionCreators({
    getDisplayName,
    getPlaceLocation,
    logout,
  }, dispatch),
)
/**
 * Header container.
 * @class Header
 */
export default class Header extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    displayName: PropTypes.shape({
      status: PropTypes.string,
      displayName: PropTypes.string,
    }),
    location: PropTypes.shape(),
    placeLocation: PropTypes.shape({
      placeId: PropTypes.string,
      result: PropTypes.object,
      status: PropTypes.string,
    }),
    user: PropTypes.shape({
      placeId: PropTypes.string,
      token: PropTypes.string,
      userId: PropTypes.string,
    }),
    tippiqIdBaseUrl: PropTypes.string,
    frontendBaseUrl: PropTypes.string,
    getDisplayName: PropTypes.func.isRequired,
    getPlaceLocation: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  }

  /**
   * Constructor
   * @method constructor
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.loadDisplayName(this.props);
    this.loadPlaceLocation(this.props);
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    this.loadDisplayName(nextProps);
    this.loadPlaceLocation(nextProps);
  }

  /**
   * Make sure displayName is loaded
   * @method loadDisplayName
   * @param {Object} props Properties
   * @returns {undefined}
   */
  loadDisplayName(props) {
    const { displayName } = props;
    const { token, placeId, userId } = props.user;
    if (displayName.status === IDLE && token) {
      this.props.getDisplayName(placeId, userId);
    }
  }

  /**
   * Make sure placeLocation is loaded
   * @method loadPlaceLocation
   * @param {Object} props Properties
   * @returns {undefined}
   */
  loadPlaceLocation(props) {
    const { placeId: userPlaceId } = props.user;
    const { placeId: placeLocationPlaceId, status } = props.placeLocation;
    if (userPlaceId &&
      userPlaceId !== placeLocationPlaceId &&
      (status === IDLE || status === SUCCESS)) {
      props.getPlaceLocation(userPlaceId);
    }
    // TODO ManagePolicies handles token in another way and would fail the test
    // if (status === FAIL && /\/huis\//.test(window.location.href)) {
    //   browserHistory.push('/');
    // }
  }

  /**
   * Logout
   * @method logout
   * @returns {undefined}
   */
  logout() {
    this.props.logout();
    browserHistory.push('/');
  }

  /**
   * render.
   * @function render
   * @returns {string} Markup of the component.
   */
  render() {
    const { placeId } = this.props.user;
    const location = this.props.placeLocation.result;
    const { tippiqIdBaseUrl, frontendBaseUrl } = this.props;
    const { displayName } = this.props.displayName;
    const title = location && location.streetName ?
      compact([
        location.streetName,
        location.nr,
        [location.addition, location.letter].join('')],
      ).join(' ') :
      'Mijn huis';
    return (
      <NavBar
        frontendBaseUrl={frontendBaseUrl}
        logout={this.logout}
        placeId={placeId}
        placeTitle={title}
        tippiqIdBaseUrl={tippiqIdBaseUrl}
        residentName={displayName}
      />);
  }
}

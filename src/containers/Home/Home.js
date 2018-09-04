/**
 * Home container.
 * @module components/Home
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import constants from '../../constants/app';

@connect(
  state => ({
    appConfig: state.appConfig,
    user: state.user,
  }),
)
/**
 * Home component.
 * @function Home
 * @returns {string} Markup of the home page.
 */
export default class Home extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    appConfig: PropTypes.shape({
      landingBaseUrl: PropTypes.string,
    }),
    user: PropTypes.shape({
      placeId: PropTypes.string,
    }),
  };

  /**
   * On component will mount
   * @function componentWillMount
   * @returns {undefined}
   */
  componentWillMount() {
    if (__CLIENT__) {
      const { landingBaseUrl } = this.props.appConfig;
      const { placeId } = this.props.user;
      if (placeId) {
        browserHistory.push(`/huis/${placeId}/mijn-huis`);
      } else {
        window.location.href = landingBaseUrl;
      }
    }
  }

  /**
   * render.
   * @function render
   * @returns {string} Markup of the component.
   */
  render() {
    return (
      <div id="page-home">
        <Helmet title="Home" />
        <div className="container">
          <h1>{constants.title}</h1>
          <h2>{constants.description}</h2>
        </div>
      </div>
    );
  }
}

/**
 * App container.
 * @module containers/App
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-connect';

import { getAppConfig } from '../../actions';
import constants from '../../constants/app';
import { Footer } from '../../components';
import { Header, CookieWall } from '../../containers';
import styles from './App.css';

/**
 * Application container class.
 * @class Application
 * @extends Component
 */
export class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    appConfig: PropTypes.object.isRequired,
    location: PropTypes.object,
    router: PropTypes.object,
  };

  /**
   * @function componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    const { location, router } = this.props;
    if (location && router) {
      const query = location.query;
      if (query.token || query.placeToken) {
        delete query.token;
        delete query.placeToken;
        router.replace({ pathname: location.pathname, query });
      }
    }
  }

  /**
   * Render
   * @function render
   * @returns the rendered elements
   */
  render() {
    const { children } = this.props;
    return (
      <div>
        <Helmet {...constants.head} />
        <CookieWall />
        <Header />
        <div className={styles.contentWrapper}>
          <div>
            {children}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default asyncConnect(
  [{
    promise: ({ store: { dispatch } }) => dispatch(getAppConfig()),
  }],
  state => ({
    appConfig: state.appConfig,
  })
)(App);

/**
 * ServiceProvider Banner component.
 * @module components/ServiceProvider/Banner
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getServiceProvider } from '../../actions';
import { SUCCESS } from '../../constants/status';

import styles from './Banner.scss';

@connect(
  state => ({
    serviceProvider: state.serviceProvider,
  }),
  dispatch => bindActionCreators({ getServiceProvider }, dispatch),
)

/**
 * Banner component class.
 * @function Banner
 * @param {Object} props Component properties.
 * @returns {string} Markup of the not found page.
 */
export default class Banner extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getServiceProvider: PropTypes.func.isRequired,
    serviceProviderId: PropTypes.string,
    serviceProvider: PropTypes.object,
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    const { serviceProviderId, serviceProvider } = this.props;
    if (serviceProviderId && serviceProviderId !== serviceProvider.id) {
      this.props.getServiceProvider(serviceProviderId);
    }
  }

  /**
   * Should component update
   * @method shouldComponentUpdate
   * @param {Object} nextProps Next properties
   * @returns {Boolean} flag whether to re-render this component or not
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.serviceProvider !== this.props.serviceProvider;
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { status, logo, name, brandColor } = this.props.serviceProvider;
    const style = { backgroundColor: `#${brandColor}` };

    return status === SUCCESS && logo && brandColor ? (
      <div className={`${styles.container}`} style={style}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <span className={`text ${styles.text}`}>Huisregels instellen voor</span>
              {logo ? <img
                alt="logo" className={`logo ${styles.logo}`}
                src={`data:image/png;base64,${logo}`}
              /> : <span className={`text ${styles.text}`}>{name}</span>}
            </div>
          </div>
        </div>
      </div>) : null;
  }
}

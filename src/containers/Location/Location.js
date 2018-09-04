/**
 * Location container.
 * @module containers/Residents
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Location as LocationComponent,
} from '../../components';
import { getPlaceLocation } from '../../actions';
import { SUCCESS } from '../../constants/status';

@connect(
  state => ({
    placeLocation: state.placeLocation,
  }),
  dispatch => bindActionCreators({
    getPlaceLocation,
  }, dispatch),
)
/**
 * Location Container class.
 * @class Location
 * @extends Component
 */
export default class Location extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    location: PropTypes.shape(),
    placeLocation: PropTypes.shape().isRequired,
    params: PropTypes.shape({
      placeId: PropTypes.string,
    }),
    getPlaceLocation: PropTypes.func.isRequired,
  };

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getPlaceLocation(this.props.params.placeId);
  }

  /**
   * Render method
   * @function render
   * @returns {string} Markup of the container.
   */
  render() {
    const { placeLocation } = this.props;
    return (
      <div id="page-location">
        <Helmet title="Locatie" />
        {
          placeLocation && placeLocation.status === SUCCESS &&
            <LocationComponent placeLocation={placeLocation} />
        }
      </div>
    );
  }
}

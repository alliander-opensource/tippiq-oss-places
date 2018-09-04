/**
 * Residents container.
 * @module containers/Residents
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Residents as ResidentsComponent } from '../../components';

import { SUCCESS } from '../../constants/status';
import {
  getResidents,
} from '../../actions';

@connect(
  state => ({
    residents: state.residents,
    userId: state.user.userId,
  }),
  dispatch => bindActionCreators({
    getResidents,
  }, dispatch),
)
/**
 * Residents Container class.
 * @class PlaceResidents
 * @extends Component
 */
export default class Residents extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    residents: PropTypes.object.isRequired,
    userId: PropTypes.string,
    params: PropTypes.object,
    getResidents: PropTypes.func.isRequired,
  };

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getResidents(this.props.params.placeId);
  }

  /**
   * Residents component.
   * @function render
   * @returns {string} Markup of the residents screen.
   */
  render() {
    const { residents, userId } = this.props;
    return (
      <div id="page-residents">
        <Helmet title="Bewoners" />
        {
          residents.list && residents.status === SUCCESS &&
            <ResidentsComponent items={residents} userId={userId} />
        }
      </div>
    );
  }
}

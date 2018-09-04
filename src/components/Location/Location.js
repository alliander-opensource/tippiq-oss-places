/**
 * Location component.
 * @module components/Location
 */

import React, { Component, PropTypes } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { flip } from 'geojson-flip';
import { cloneDeep } from 'lodash';

import mapIcon from '../../static/leaflet/map-green.png';
import mapIcon2x from '../../static/leaflet/map-green-2x.png';
import mapIconShadow from '../../static/leaflet/marker-shadow.png';

import styles from './Location.scss';

let Map;
let TileLayer;
let Marker;
let Leaflet;

/**
 * Location Component.
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
    placeLocation: PropTypes.object,
  };

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    // Only runs on Client, not on server render
    // https://github.com/PaulLeCam/react-leaflet/issues/45
    Map = require('react-leaflet').Map; // eslint-disable-line
    TileLayer = require('react-leaflet').TileLayer; // eslint-disable-line
    Marker = require('react-leaflet').Marker; // eslint-disable-line
    Leaflet = require('leaflet'); // eslint-disable-line
    this.forceUpdate();
  }

  /**
   * getUrlByProtocol get the current Protocol
   * @method getUrlByProtocol
   * @returns {string} empty string
   */
  getUrlByProtocol() {
    if (__CLIENT__) {
      if (window.location.protocol === 'https') {
        return 'https://{s}.tile.osm.org/{z}/{x}/{y}.png';
      }
      return 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    }
    return '';
  }

  /**
   * RenderPlaceLocation method
   * @function renderPlaceLocation
   * @returns {string} Markup of the place location render method.
   */
  renderPlaceLocation() {
    const { placeLocation } = this.props;
    if (!placeLocation.result) return null;

    const {
      geometry, streetName, nr, addition, letter, zipcodeDigits,
      zipcodeLetters, cityName,
    } = placeLocation.result;
    const flippedCoordinates = flip(cloneDeep(geometry));
    const coordinates = geometry.type === 'Point' ? flippedCoordinates.coordinates
      : flippedCoordinates.coordinates[0];
    const icon = Leaflet &&
      Leaflet.icon({
        iconUrl: mapIcon,
        iconRetinaUrl: mapIcon2x,
        shadowUrl: mapIconShadow,
        iconSize: [71, 71], // size of the icon
        shadowSize: [73, 23], // size of the shadow
        iconAnchor: [30, 71], // point of the icon which will correspond to marker's location
        shadowAnchor: [2, 23],  // the same for the shadow
        popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
      });

    const url = this.getUrlByProtocol();
    const mapProps = {
      zoom: 16,
      ...(geometry.type === 'Point' ? { center: coordinates } : { bounds: coordinates }),
    };
    const map = Map &&
      (<Map {...mapProps}>
        <TileLayer
          attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          url={url}
        />
        {geometry.type === 'Point' && <Marker position={coordinates} icon={icon} />}
      </Map>);

    return (
      <Grid>
        <Row>
          <Col sm={12}><h3>Mijn huis</h3></Col>
        </Row>
        <Row>
          <Col sm={12} className={styles.container}>
            <div className={styles.addressContainer}>
              <div className={styles.address}>
                <h4 className="location-name">{streetName} {nr} {addition}{letter}</h4>
                <p>
                  {streetName} {nr} {addition}{letter}<br />
                  {zipcodeDigits} {zipcodeLetters}
                  {zipcodeDigits && <span>&nbsp;&nbsp;</span>}{cityName}
                </p>
              </div>
              <div className={styles.map}>
                {map}
              </div>
            </div>
          </Col>
        </Row>
      </Grid>);
  }

  /**
   * renderNoLocation method
   * @function renderNoLocation
   * @returns {string} Markup of the no location render method.
   */
  renderNoLocation() {
    return (
      <Grid>
        <Row>
          <Col sm={12}><h3>Mijn huis</h3></Col>
        </Row>
        <Row>
          <Col sm={12} className={styles.container}>
            <div className={styles.addressContainer}>
              <div className={styles.address}>
                <h4 className="location-name">Bij dit huis is geen locatie ingesteld</h4>
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }

  /**
   * Render method
   * @function render
   * @returns {string} Markup of component.
   */
  render() {
    const { placeLocation } = this.props;
    return (
      <div>
        { (placeLocation) ? this.renderPlaceLocation() : this.renderNoLocation() }
      </div>
    );
  }
}

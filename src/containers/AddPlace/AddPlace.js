/**
 * AddPlace container.
 * @module components/AddPlace
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { get } from 'lodash';

import { Spinner } from '../../components';
import { AddressSuggestion } from '../../containers';
import { IDLE, SUCCESS, FAIL } from '../../constants/status';
import { setQueryParams, setQueryParam, fixBaseUrl } from '../../utils/url';
import { authorize, addPlace } from '../../actions';

import styles from './AddPlace.css';

@connect(
  state => ({
    appConfig: state.appConfig,
    places: state.places,
    user: state.user,
    addressSuggestion: state.addressSuggestion,
  }),
  dispatch => bindActionCreators({
    authorize,
    addPlace,
  }, dispatch),
)

/**
 * AddPlace component.
 * @function AddPlace
 * @returns {string} Markup of the add place page.
 */
export default class AddPlace extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    appConfig: PropTypes.shape({
      frontendBaseUrl: PropTypes.string,
      tippiqIdBaseUrl: PropTypes.string,
      locationAttributeType: PropTypes.string,
    }),
    location: PropTypes.object,
    places: PropTypes.object,
    addressSuggestion: PropTypes.object,
    authorize: PropTypes.func.isRequired,
    addPlace: PropTypes.func.isRequired,
    user: PropTypes.object,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Properties
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.createPlace = this.createPlace.bind(this);
    this.redirect = this.redirect.bind(this);
    this.state = {
      selected: false,
      suggestionError: null,
      continueProgress: null,
    };
  }

  /**
   * AddPlace component.
   * @function componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    const { token } = this.props.user;
    if (!token) {
      this.getUserSession();
    }
  }

  /**
   * AddPlace component.
   * @function componentWillReceiveProps
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    const { status } = nextProps.places;
    if (status === 'PENDING') {
      this.setState({
        continueProgress: false,
      }, () => {
        this.counter = setInterval(this.delayProgress.bind(this), 3000);
      });
    }
  }

  /**
   * Redirect to User session retrieval
   * @function getUserSession
   * @returns {undefined}
   */
  getUserSession() {
    const { tippiqIdBaseUrl, frontendBaseUrl } = this.props.appConfig;

    window.location.href = setQueryParams(`${tippiqIdBaseUrl}/selecteer-je-huis`, {
      redirect_uri: encodeURIComponent(fixBaseUrl(frontendBaseUrl)),
      audience: 'places',
    });
  }

  /**
   * Delay, so animation is shown
   * @function delayProgress
   * @returns {undefined}
   */
  delayProgress() {
    this.setState({
      continueProgress: true,
    }, () => {
      clearInterval(this.counter);
    });
  }

  /**
   * Redirect the user after submit
   * @function redirect
   * @returns {undefined}
   */
  redirect() {
    const { frontendBaseUrl } = this.props.appConfig;
    const returnUrl = get(this.props, 'location.query.return_url');
    const { token, placeId } = this.props.places.result;
    let redirectUrl;
    if (returnUrl) {
      redirectUrl = decodeURIComponent(returnUrl);
      const urlParts = redirectUrl.split('return_route=');
      redirectUrl = `${urlParts[0]}return_route=${encodeURIComponent(urlParts[1])}`;
      redirectUrl = setQueryParam(redirectUrl, 'placeToken', token);
    } else {
      redirectUrl = `${frontendBaseUrl}/huis/${placeId}/mijn-huis`;
    }
    window.location.href = `/api/redirect/?clientId=&uri=${encodeURIComponent(redirectUrl)}`;
  }

  /**
   * Create a place
   * @method createPlace
   * @returns {undefined}
   */
  createPlace() {
    if (this.props.addressSuggestion.selected) {
      this.setState({
        emailError: false,
        suggestionError: false,
      }, () => {
        const placeAddress = {
          attributeType: this.props.appConfig.locationAttributeType,
          ...this.props.addressSuggestion.selected,
        };
        this.props.addPlace(placeAddress);
      });
    } else {
      this.setState({
        suggestionError: !this.props.addressSuggestion.selected,
      });
    }
  }
  /**
   * AddPlace component.
   * @function render
   * @returns {string} Markup of the add place screen.
   */
  render() {
    const { status } = this.props.places;

    return (
      <div id="page-add-place">
        <Helmet title="Nieuw huis" />
        <Grid className={styles.container}>
          <Row>
            <Col sm={12}>
              {status !== SUCCESS && <h3>Nieuw Tippiq Huis aanmaken</h3>}
              {status === SUCCESS && this.state.continueProgress && <h3>Gelukt!</h3>}
            </Col>
          </Row>
          {status === IDLE &&
            <Row>
              <Col sm={9}>
                <p>
                  Wil je gebruik maken van diensten voor je huis?
                  Vul dan hieronder je adres in om je Tippiq Huis te bouwen.
                </p>
              </Col>
            </Row>
          }
          {status === IDLE &&
            <Row>
              <Col sm={9}>
                <AddressSuggestion required />
              </Col>
              <Col sm={3}>
                <Button onClick={this.createPlace}>Aanmaken</Button>
              </Col>
            </Row>
          }
          <Row>
            <Col sm={12}>
              {this.state.continueProgress === false &&
                <Spinner type={'house'} />
              }
              {status === SUCCESS && this.state.continueProgress &&
                <p>Je nieuwe Tippiq Huis is gebouwd.</p>
              }
              {status === SUCCESS && this.state.continueProgress &&
                <Button onClick={this.redirect}>Ga verder</Button>
              }
              {status === FAIL && this.state.continueProgress &&
                <p>Je huis is helaas niet aangemaakt.</p>
              }
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

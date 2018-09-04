/**
 * NavBar component.
 * @module components/NavBar
 */

import React, { Component, PropTypes } from 'react';
import { Navbar, Nav, Dropdown, MenuItem, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';
import { truncate } from 'lodash';

import styles from './NavBar.css';
import tippiqLogo from '../../static/images/huis.svg';
import userIcon from '../../static/svgIcons/user.svg';
import { ResidentName } from '../../components';

/**
 * NavBar Container component.
 * @function NavBar
 * @returns {string} Markup of the component.
 */
export default class NavBarContainer extends Component {
  static propTypes = {
    frontendBaseUrl: PropTypes.string,
    logout: PropTypes.func,
    placeTitle: PropTypes.string,
    placeId: PropTypes.string,
    residentName: PropTypes.string,
    tippiqIdBaseUrl: PropTypes.string,
  };

  /**
   * Constructor
   * @method constructor
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.renderDropdownContent = this.renderDropdownContent.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.renderDropDownItems = this.renderDropDownItems.bind(this);
    this.renderMenuItems = this.renderMenuItems.bind(this);
    this.state = {
      width: 0,
      height: 0,
    };
  }

  /**
   * ComponentWillMount
   * @function componentWillMount
   * @returns {undefined}
   */
  componentWillMount() {
    if (__CLIENT__) {
      this.updateDimensions();
      window.addEventListener('resize', this.updateDimensions);
    }
  }

  /**
   * ComponentWillUnmount
   * @function componentWillUnmount
   * @returns {undefined}
   */
  componentWillUnmount() {
    if (__CLIENT__) {
      window.removeEventListener('resize', this.updateDimensions);
    }
  }

  /**
   * UpdateDimensions
   * @function UpdateDimensions
   * @returns {undefined}
   */
  updateDimensions() {
    this.setState({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    });
  }

  /**
   * CheckDimensions
   * @function CheckDimensions
   * @returns {undefined}
   */
  checkDimensions() {
    return ({
      width: this.state.width,
      height: this.state.height,
    });
  }

  /**
   * RenderDropdownContent
   * @function renderDropdownContent
   * @returns {string} Markup of the residents screen.
   */
  renderDropdownContent(visible) {
    if (__CLIENT__) {
      const {
        placeTitle,
        residentName,
        tippiqIdBaseUrl,
      } = this.props;
      const residentChangeUrl = `${tippiqIdBaseUrl}/mijn-account/naam`;

      return (
        <div
          className={`${styles.contentWrapper}
          ${(!visible) && 'hidden-xs'} `}
        >
          <div className={styles.buttonTextHolder}>
            <ResidentName text={residentName} classNameText={styles.residentName}>
              { !residentName &&
                <a href={residentChangeUrl} className={styles.residentAnchor}>Pas aan</a>
              }
            </ResidentName>
          </div>
          <span className={styles.placeTitle}>{placeTitle && truncate(placeTitle, { length: 20, separator: '..' })}</span>
        </div>
      );
    }
    return null;
  }

  /**
   * RenderMenuItems
   * @function rrenderMenuItems
   * @returns {string} Markup of the menuItems
   */
  renderMenuItems() {
    const {
      placeId,
    } = this.props;
    const placeUrl = placeId && `/huis/${placeId}`;

    return (
      <Nav className={[styles.navBarBlock, styles.navBarNavigation]}>
        {placeUrl &&
          <LinkContainer to={`${placeUrl}/mijn-huis`}>
            <NavItem className={styles.navBarItem} eventKey={1}>
              <span className="hidden-xs">Mijn huis</span>
              <span className="visible-xs"><span className={styles.iconHuis} /><br />Mijn huis</span>
            </NavItem>
          </LinkContainer>
        }
        {placeUrl &&
          <LinkContainer to={`${placeUrl}/diensten`}>
            <NavItem className={styles.navBarItem} eventKey={2}>
              <span className="hidden-xs">Diensten</span>
              <span className="visible-xs"><span className={styles.iconDiensten} /><br />Diensten</span>
            </NavItem>
          </LinkContainer>
        }
      </Nav>
    );
  }

  /**
   * RenderDropDownItems
   * @function renderDropDownItems
   * @returns {string} Markup of the dropdownItems
   */
  renderDropDownItems() {
    const {
      frontendBaseUrl,
      logout,
      placeId,
      tippiqIdBaseUrl,
    } = this.props;

    const loginUrl = `${frontendBaseUrl}/login`;
    const placeChangeUrl = `${tippiqIdBaseUrl}/selecteer-je-huis?redirect_uri=${loginUrl}&audience=places`;
    const myAccountUrl = `${tippiqIdBaseUrl}/mijn-account/naam`; // todo: fix indexroute in ID

    return (
      <Dropdown
        className={styles.navBarDropdown}
        componentClass="li"
        id="basic-nav-dropdown"
      >
        <Dropdown.Toggle className={styles.headerButtonBlock}>
          <div className={styles.horizontal}>
            <img className={styles.houseImage} src={userIcon} alt="Huis" width="32" height="30" />
            {this.renderDropdownContent()}
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {
            (__CLIENT__ && this.checkDimensions().width < 768 && placeId) &&
              <div className={styles.dropdownContent}>{this.renderDropdownContent(true)}</div>
          }
          <MenuItem eventKey={3.1} href={myAccountUrl}>Mijn Account</MenuItem>
          <MenuItem eventKey={3.2} href={placeChangeUrl}>Wissel van huis</MenuItem>
          <MenuItem eventKey={3.3} onClick={logout}>Uitloggen</MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  /**
   * Render
   * @function render
   * @returns {string} Markup of the component.
   */
  render() {
    const { placeId } = this.props;
    const brandUrl = placeId ? `/huis/${placeId}/mijn-huis` : '/login';

    return (
      <Navbar inverse className={styles.navBar}>
        <Navbar.Header className={styles.navBarHeader}>
          <Navbar.Brand className={styles.navBarBrand}>
            <Link to={brandUrl}>
              <img src={tippiqLogo} alt="Tippiq" className={styles.headerImage} />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <div className={styles.navBarBlock}>
          {this.renderDropDownItems()}
        </div>
        {this.renderMenuItems()}
      </Navbar>
    );
  }
}

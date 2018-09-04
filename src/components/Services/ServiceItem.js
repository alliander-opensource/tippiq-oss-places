/**
 * ServiceItem component.
 * @module components/ServiceItem
 */

import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Modal, Row, Col } from 'react-bootstrap';
import styles from './ServiceItem.css';

/**
 * ServiceItem component
 * @class ServiceItem
 */
export default class ServiceItem extends Component {

  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    serviceItem: PropTypes.object.isRequired,
    itemIsActiveService: PropTypes.bool,
    placeId: PropTypes.string.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Properties
   * @returns {undefined}
   */
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  /**
   * closeModal
   * @method closeModal
   * @returns {undefined}
   */
  closeModal() {
    this.setState({ showModal: false });
  }

  /**
   * openModal
   * @method openModal
   * @returns {undefined}
   */
  openModal() {
    this.setState({ showModal: true });
  }

  /**
   * Create register link for service
   * @method createRegisterLink
   * @returns {string} Service register url
   */
  createRegisterLink() {
    const { serviceItem, placeId } = this.props;
    // simple replace, improve templating if more than a single val/placeId needs to be replaced
    return serviceItem.content.registerLink ?
      serviceItem.content.registerLink.replace('{{placeId}}', placeId) : null;
  }

  /**
   * Renders the modal with service information
   * @method renderModal
   * @returns {string} Markup for the modal
   */
  renderModal() {
    const { serviceItem, itemIsActiveService = false } = this.props;
    return (
      <Modal bsSize="large" show={this.state.showModal} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <img
            alt="logo" className={`logo ${styles.logo}`}
            src={`data:image/png;base64,${serviceItem.logo}`}
          />
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={12} className="visible-xs-block">
              <img
                alt="Dienst" className={styles.serviceImage}
                src={serviceItem.content.popup.image}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={5}>
              <h4>{serviceItem.content.popup.header}</h4>
              <div
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: serviceItem.content.popup.body }}
              />
            </Col>
            <Col sm={7} className="hidden-xs">
              <img
                alt="Dienst" className={styles.serviceImage}
                src={serviceItem.content.popup.image}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {!itemIsActiveService && serviceItem.content.popup.moreInfoLink &&
            <a
              href={serviceItem.content.popup.moreInfoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-default block-on-mobile hidden-xs"
            >Meer info</a>}
          {!itemIsActiveService && !serviceItem.content.inDevelopment &&
            <a
              href={this.createRegisterLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary block-on-mobile"
            >Direct aanmelden</a>}
          {!itemIsActiveService && serviceItem.content.popup.moreInfoLink &&
            <a
              href={serviceItem.content.popup.moreInfoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-default block-on-mobile visible-xs-block"
            >Meer info</a>}
          {itemIsActiveService &&
            <a
              href={serviceItem.content.serviceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary block-on-mobile"
            >Ga naar de dienst</a>}
        </Modal.Footer>
      </Modal>
    );
  }

  /**
   * Render
   * @function render
   * @returns {string} Markup of the component.
   */
  render() {
    const { serviceItem, placeId, itemIsActiveService = false } = this.props;
    return (
      <div className={styles.serviceItem}>
        {this.renderModal()}
        <button onClick={this.openModal} className={styles.clickableContainer}>
          {serviceItem.content.inDevelopment ? <div className={styles.inDevelopment} /> : null}
          <div className={styles.logoContainer}>
            <img
              alt="logo" className={`logo ${styles.logo}`}
              src={`data:image/png;base64,${serviceItem.logo}`}
            />
          </div>
          <hr className={styles.ruler} />
          <p className={styles.serviceTitle}>{serviceItem.content.serviceTitle}</p>
        </button>
        {itemIsActiveService ?
          <div className={styles.buttonContainer}>
            <a
              href={serviceItem.content.serviceLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.serviceButton}
            >Ga naar</a>
            <Link to={`/huis/${placeId}/${serviceItem.id}/huisregels`} className={styles.serviceButton}>Bewerken</Link>
          </div>
          :
          <div className={styles.buttonContainer}>
            {!serviceItem.content.inDevelopment ?
              <a
                href={this.createRegisterLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.serviceButton}
              >Aanmelden</a> : null}
            <a // eslint-disable-line jsx-a11y/no-static-element-interactions
              className={styles.serviceButton} onClick={this.openModal}
            >Meer info</a>
          </div>
        }
      </div>
    );
  }
}

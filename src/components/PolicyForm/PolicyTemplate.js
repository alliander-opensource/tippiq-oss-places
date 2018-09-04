/**
 * PolicyTemplate component.
 * @module components/PolicyForm/PolicyTemplate
 */

import React, { Component, PropTypes } from 'react';

import styles from './PolicyTemplate.scss';

/**
 * PolicyTemplate component class.
 * @function PolicyTemplate
 * @param {Object} props Component properties.
 * @param {Object} props.field Field form state data.
 * @param {Object} props.policy Policy data.
 * @returns {string} Markup of the PolicyTemplate component.
 */
export default class PolicyTemplate extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    field: PropTypes.object.isRequired,
    policy: PropTypes.object.isRequired,
    warnOnTouched: PropTypes.bool.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties.
   * @constructs PolicyTemplate
   */
  constructor(props) {
    super(props);
    this.state = {
      isReadMoreExpanded: false,
    };
    this.toggleReadMore = this.toggleReadMore.bind(this);
  }

  /**
   * PolicyTemplate component.
   * @function toggleReadMore
   * @returns {undefined}
   */
  toggleReadMore() {
    this.setState({ isReadMoreExpanded: !this.state.isReadMoreExpanded });
  }

  /**
   * PolicyTemplate component.
   * @function render
   * @returns {string} Markup of the policy template component.
   */
  render() {
    const { field, policy, warnOnTouched } = this.props;
    const criticalMark = policy.critical ? <mark>*</mark> : null;
    let errorMessage = null;
    let itemClassNames = 'list-group-item borderless';

    if ((warnOnTouched && field.visited && !field.checked && policy.critical) ||
        (!warnOnTouched && field.error && field.touched)) {
      errorMessage = (
        <div className={`text-danger ${styles.warning}`}>
          {policy.criticalDisableWarning}
        </div>
      );
      itemClassNames += ' has-error';
    }

    const listItems = [(
      <li className={`${itemClassNames} ${styles.list_item_policy_title}`} key={field.name}>
        <div className="checkbox">
          <label htmlFor={field.name}>
            <input
              type="checkbox"
              id={field.name}
              {...field}
            />
            {policy.title} {criticalMark}
          </label>
        </div>
        {errorMessage}
      </li>)];

    if (this.state.isReadMoreExpanded) {
      listItems.push(
        <li  // eslint-disable-line jsx-a11y/no-static-element-interactions
          key={`${field.name}_less`} className={`${itemClassNames} collapse-header in`}
          onClick={this.toggleReadMore}
        ><i className="fa fa-times" aria-hidden="true" />&nbsp;Minder weergeven</li>);
      listItems.push(
        <li
          key={`${field.name}_moretext`}
          className="list-group-item borderless collapse-body"
        >{policy.description}</li>);
    } else {
      listItems.push(
        <li  // eslint-disable-line jsx-a11y/no-static-element-interactions
          key={`${field.name}_more`}
          className={`${itemClassNames} collapse-header ${styles.list_item_more_info}`}
          onClick={this.toggleReadMore}
        >Meer over deze huisregel</li>);
    }

    return <div className="list-item-panel borderless policy">{listItems}</div>;
  }
}

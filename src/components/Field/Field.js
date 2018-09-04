/**
 * Field component.
 * @module components/Field
 */

import React, { PropTypes } from 'react';

/**
 * Register form component class.
 * @function Field
 * @param {Object} props Component properties.
 * @param {Object} props.field Field data.
 * @param {string} props.label Lavel of the field.
 * @param {string} props.type Type of the field.
 * @param {string} props.placeholder Placeholder of the field.
 * @returns {string} Markup of the not found page.
 */
const Field = ({ field, label, type, placeholder }) =>
  <div className={`form-group ${field.error && field.touched ? ' has-error' : ''}`}>
    {label && <label htmlFor={field.name} className="col-sm-2">{label}</label>}
    <input
      type={type}
      className="form-control"
      id={field.name}
      placeholder={placeholder}
      {...field}
    />
    {field.error && field.touched && <div className="text-danger">{field.error}</div>}
  </div>;

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Field.propTypes = {
  field: PropTypes.object.isRequired,
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

export default Field;

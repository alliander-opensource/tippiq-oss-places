/**
 * EditPolicyForm component.
 * @module components/EditPolicyForm/EditPolicyForm
 */

import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';

import { PolicyTemplate } from '../';

import styles from './EditPolicyForm.css';

/**
 * Consent form component class.
 * @function EditPolicyForm
 * @param {Object} fields Fields for the form.
 * @param {Object} policies Policy data.
 * @param {Function} handleSubmit Submit form handler.
 * @param {string} cancelLink Link to redirect on cancel.
 * @param {boolean} submitting Submitting state.
 * @returns {string} Markup of the component.
 */
const EditPolicyForm = ({
  fields,
  policies,
  handleSubmit,
  cancelLink,
  submitting,
}) =>
  <div>
    <form onSubmit={handleSubmit}>
      <div className={`panel panel-default borderless ${styles.panel}`}>
        <ul className="list-group">
          {policies.map(policy =>
            <PolicyTemplate
              warnOnTouched={false}
              key={policy.templateSlug}
              field={fields[policy.templateSlug]}
              policy={policy}
            />
          )}
        </ul>
      </div>
      <div className={styles.buttonBar}>
        <button
          type="submit"
          id="submitPolicyTemplates"
          disabled={submitting}
          className={`btn btn-primary pull-right ${styles.buttonBarButton}`}
        >Opslaan
        </button>
        <Link className={`btn btn-default pull-right ${styles.buttonBarButton}`} to={cancelLink}>Annuleren</Link>
      </div>
    </form>
  </div>;

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
EditPolicyForm.propTypes = {
  fields: PropTypes.object.isRequired,
  policies: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  cancelLink: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'dynamic',
})(EditPolicyForm);

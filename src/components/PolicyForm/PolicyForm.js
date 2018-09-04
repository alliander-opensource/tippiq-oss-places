/**
 * PolicyForm component.
 * @module components/PolicyForm/PolicyForm
 */

import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import _ from 'lodash';

import { PolicyTemplate, ServiceProviderName } from '../index';
import styles from './PolicyForm.scss';

/**
 * Consent form component class.
 * @function PolicyForm
 * @param {Object} fields Fields for the form.
 * @param {Object} policiesRequest PoliciesRequest for the form.
 * @param {Object} policies Policy data.
 * @param {string} clientId ServiceProvider Id.
 * @param {Function} handleSubmit Submit form handler.
 * @param {boolean} submitting Submitting state.
 * @param {boolean} isSetup Enables setup mode.
 * @returns {string} Markup of the component.
 */

const PolicyForm = ({
  policiesRequest,
  fields,
  policies,
  clientId,
  handleSubmit,
  submitting,
  isSetup,
}) =>
  <div>
    {isSetup ? (
      <div className="panel panel-default borderless">
        <ul className="list-group" id="consentPanel">
          <li className="list-group-item checked">
            Ik gebruik dit Tippiq account om mijn huisregels te regelen voor de dienst
            van&nbsp;
            <ServiceProviderName serviceProviderId={clientId} />, en geef&nbsp;
            <ServiceProviderName serviceProviderId={clientId} />&nbsp;toestemming mijn huisregels
            voor deze dienst bij Tippiq uit te lezen.
          </li>
        </ul>
      </div>) : null }
    <form onSubmit={handleSubmit}>
      <div className="panel panel-default borderless">
        {policiesRequest.map((policySet, i) =>
          <div key={i}>
            <div className="panel-heading">{policySet.title}</div>
            <ul className="list-group">
              {policySet.policies.map(slug =>
                <PolicyTemplate
                  warnOnTouched={!isSetup}
                  key={slug}
                  field={fields[slug]}
                  policy={_.find(policies, { slug })}
                />
              )}
            </ul>
          </div>
        )}
        <div className="panel-footer borderless">
          <p className="discreet">
            Huisregels met een
            <mark>*</mark>
            moeten worden aangevinkt om gebruik te kunnen maken
            van <ServiceProviderName serviceProviderId={clientId} />
          </p>
        </div>
      </div>
      <div className={`col-xs-12 col-sm-6 col-lg-5 ${styles.submit_button_container}`}>
        <button
          type="submit"
          id="submitPolicyTemplates"
          disabled={submitting}
          className="btn btn-block btn-primary"
        >Opslaan & terug naar <ServiceProviderName serviceProviderId={clientId} />
        </button>
      </div>
    </form>
  </div>;

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
PolicyForm.propTypes = {
  fields: PropTypes.object.isRequired,
  policiesRequest: PropTypes.array.isRequired,
  policies: PropTypes.array.isRequired,
  clientId: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  isSetup: PropTypes.bool.isRequired,
};

const validate = (values, props) => {
  const errors = {};

  if (props.isSetup) {
    props.policies.forEach((policy) => {
      if (policy.critical && !values[policy.slug]) {
        errors[policy.slug] = policy.criticalDisableWarning;
      }
    });
  }

  return errors;
};

export default reduxForm({
  form: 'dynamic',
  validate,
})(PolicyForm);

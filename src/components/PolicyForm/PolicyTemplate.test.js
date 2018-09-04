import React from 'react';
import { render } from 'enzyme';
import { PolicyTemplate } from '../../components';

const policy = {
  slug: 'policy',
  title: 'Title',
  description: 'Description',
  critical: false,
};

const requiredPolicy = {
  slug: 'policy-required',
  title: 'Title',
  description: 'Description',
  critical: true,
  criticalDisableWarning: 'Required field',
};

describe('PolicyTemplate component', () => {
  /**
   * PolicyTemplate spec file.
   * @function updatePolicy
   * @returns {undefined}
   */
  const updatePolicy = () => {};

  it('should render a checkbox without a required mark', () => {
    const wrapper = render(
      <PolicyTemplate
        field={{ name: policy.slug }}
        policy={policy}
        warnOnTouched={false}
        updatePolicy={updatePolicy}
      />
    );
    const input = wrapper.find('input');
    const mark = wrapper.find('mark');

    expect(input.get(0).attribs.type).toEqual('checkbox');
    expect(mark.length).toEqual(0);
  });

  it('should render a * mark when policy is required', () => {
    const wrapper = render(
      <PolicyTemplate
        field={{ name: requiredPolicy.slug }}
        policy={requiredPolicy}
        warnOnTouched={false}
        updatePolicy={updatePolicy}
      />
    );

    const mark = wrapper.find('mark');
    expect(mark.length).toEqual(1);
  });
});

import React from 'react';
import renderer from 'react-test-renderer';
import Element from './ResidentName';

describe('ResidentName', () => {
  test('with displayName', () => {
    const component = renderer.create(
      <Element text={'Chuck Norris'} />
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  test('with displayName', () => {
    const component = renderer.create(
      <Element text={'test@example.com'} />
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  test('without displayName', () => {
    const component = renderer.create(
      <Element text={null} />
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  test('with very long name', () => {
    const component = renderer.create(
      <Element text={'Edward van Llanfair­pwllgwyngyll­gogery­chwyrn­drobwll­llan­tysilio­gogo­goch'} />
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  test('with short length limit', () => {
    const component = renderer.create(
      <Element truncateAt={5} text={'Edward van Llanfair­pwllgwyngyll­gogery­chwyrn­drobwll­llan­tysilio­gogo­goch'} />
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  test('with long length limit', () => {
    const component = renderer.create(
      <Element truncateAt={40} text={'Edward van Llanfair­pwllgwyngyll­gogery­chwyrn­drobwll­llan­tysilio­gogo­goch'} />
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  test('with ludicrous length limit', () => {
    const component = renderer.create(
      <Element truncateAt={9999} text={'Edward van Llanfair­pwllgwyngyll­gogery­chwyrn­drobwll­llan­tysilio­gogo­goch'} />
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  test('with children', () => {
    const component = renderer.create(
      <Element text={'Chuck Norris'}>
        <a href="/pas-aan">Pas aan</a>
      </Element>
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});

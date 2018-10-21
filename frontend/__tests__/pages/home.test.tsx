import React from 'react';
import renderer from 'react-test-renderer';

import Home from '../../pages/home';

describe('Home page', () => {
  it('should match snapshot', () => {
    const component = renderer.create(<Home />);
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});

import React from 'react';
import renderer from 'react-test-renderer';

import Index from '../../pages/index';

describe('index page', () => {
  it('should match snapshot', () => {
    const component = renderer.create(<Index isAuthenticated={true} />);
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});

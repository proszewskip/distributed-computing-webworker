import React from 'react';
import renderer from 'react-test-renderer';

import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  it('should match snapshot', () => {
    const instance = renderer.create(
      <Sidebar title="Bar">
        <div>Foo</div>
      </Sidebar>,
    );

    expect(instance.toJSON()).toMatchSnapshot();
  });
});

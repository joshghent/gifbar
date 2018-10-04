import React from 'react';
import { shallow } from 'enzyme';
import spinner from './spinner';

it("renders without crashing", () => {
  shallow(<spinner />);
});

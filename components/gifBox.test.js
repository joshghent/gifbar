import React from 'react';
import { shallow } from 'enzyme';
import gifBox from './gifBox';

it("renders without crashing", () => {
  shallow(<gifBox />);
});

import React from 'react';
import { shallow } from 'enzyme';
import gifItem from './gifItem';

it("renders without crashing", () => {
  shallow(<gifItem />);
});

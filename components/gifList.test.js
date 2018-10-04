import React from 'react';
import { shallow } from 'enzyme';
import gifList from './gifList';

it("renders without crashing", () => {
  shallow(<gifList />);
});

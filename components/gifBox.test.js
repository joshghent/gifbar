import React from 'react';
import { shallow } from 'enzyme';
import GifBox from './gifBox';

it("renders without crashing", () => {
  shallow(<GifBox />);
});

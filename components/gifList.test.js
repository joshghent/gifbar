import React from 'react';
import { shallow } from 'enzyme';
import GifList from './gifList';

it("renders without crashing", () => {
  shallow(<GifList />);
});

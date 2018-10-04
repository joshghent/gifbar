import React from 'react';
import { shallow } from 'enzyme';
import GifBox from './gifBox';
import { mockGifs } from '../__mocks__/dataMocks';

it('Renders Spinner or GifList according to gifs in the state', () => {
  const wrapper = shallow(<GifBox />);
  expect(wrapper.find('Spinner')).toHaveLength(1);
  wrapper.setState({ gifs: mockGifs });
  expect(wrapper.find('GifList')).toHaveLength(1);
});

import React from 'react';
import { shallow } from 'enzyme';
import GifList from './gifList';
import { mockGifs } from '../__mocks__/dataMocks';

let GifListWrapper;
let mockOnSearch;

beforeEach(() => {
  mockOnSearch = jest.fn();
  GifListWrapper = (<GifList gifs={mockGifs} />);
});

it("Copies gif on gif click", () => {
  const wrapper = shallow(GifListWrapper);
  expect(wrapper.instance().state.copied).toBeNull();
  const gifItem = wrapper.find('GifItem').filterWhere(n => n.props().gifId === 0);
  gifItem.simulate('gifClick', 0);
  expect(wrapper.instance().state.copied).toBe(0);
});

import React from 'react';
import { shallow } from 'enzyme';
import GifItem from './gifItem';

const mockGif = {
  images: {
    original: {
      url: 'image-url'
    },
    fixed_width_small: {
      url: 'image-small-width-url'
    }
  }
};

it("renders without crashing", () => {
  shallow(
    <GifItem
      gif={mockGif}
      gifId={0}
      onGifClick={jest.mock()}
      isCopied={false}
    />
  );
});

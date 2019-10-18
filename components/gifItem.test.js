import React from "react";
import { shallow } from "enzyme";
import GifItem from "./gifItem";
import { mockGifs } from "../__mocks__/dataMocks";

const mockGifId = 0;

let mockOnGifClick;
let GifItemWrapper;

beforeEach(() => {
  mockOnGifClick = jest.fn();
  GifItemWrapper = (
    <GifItem
      gif={mockGifs[0]}
      gifId={mockGifId}
      onGifClick={mockOnGifClick}
      isCopied={false}
    />
  );
});

it("Calls method passed onGifClick with the gif id as argument", () => {
  const wrapper = shallow(GifItemWrapper);
  wrapper.find("CopyToClipboard").simulate("copy");
  expect(mockOnGifClick).toHaveBeenLastCalledWith(mockGifId);
});

it("Adds \"copied\" className to div when gif is copied", () => {
  const wrapper = shallow(GifItemWrapper);
  expect(wrapper.find("div[className=\"gif-item\"]")).toHaveLength(1);
  wrapper.setProps({ isCopied: true });
  expect(wrapper.find("div[className=\"gif-item copied\"]")).toHaveLength(1);
});

import React from "react";
import GifItem from "./gifItem.jsx";
import map from "lodash.map";

export default props => {
  const gifNodes = map(props.gifs, (gif, index) => {
    return (
      <GifItem
        gif={gif}
        key={index}
        gifId={index}
        onGifClick={gifId => props.handleGifClick(gifId)}
        isCopied={props.copied === index}
      />
    );
  });

  return (
    <div>
      <img src="./../assets/giphy-mark.png" className="giphy-watermark" />
      <div className="gif-list">{gifNodes}</div>
    </div>
  );
};

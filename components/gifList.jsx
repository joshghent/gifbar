import React from 'react';
import map from 'lodash.map';
import GifItem from './gifItem';

const GifList = ({ gifs, handleGifClick, copied }) => {
  const gifNodes = map(gifs, (gif, index) => (
    <GifItem
      gif={gif}
      key={index}
      gifId={index}
      onGifClick={handleGifClick}
      isCopied={copied === index}
    />
  ));
  return (
    <div>
      <img src="./../assets/giphy-mark.png" className="giphy-watermark" alt="" />
      <div className="gif-list">{gifNodes}</div>
    </div>
  );
};

export default GifList;

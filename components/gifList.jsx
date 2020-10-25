import map from 'lodash.map';
import PropTypes from 'prop-types';
import React from 'react';

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
GifList.propTypes = {
  gifs: PropTypes.shape({
    originalUrl: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
  }).isRequired,
  handleGifClick: PropTypes.func.isRequired,
  copied: PropTypes.number.isRequired,
};

export default GifList;

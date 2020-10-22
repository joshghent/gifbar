import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const GifItem = ({ gif, onGifClick, gifId, isCopied }) => {
  return (
    <CopyToClipboard text={gif.originalUrl} onCopy={() => onGifClick(gifId)}>
      <div className={isCopied ? "gif-item copied" : "gif-item"}>
        <img className="gif" src={gif.thumbnailUrl} />
        <div className="copy-indication">Copied!</div>
        <div className="overlay"></div>
      </div>
    </CopyToClipboard>
  )
}

export default GifItem;

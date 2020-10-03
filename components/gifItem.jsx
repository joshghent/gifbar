import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default props => {
  const { gif } = { props };

  return (
    <CopyToClipboard
      text={gif.originalUrl}
      onCopy={() => props.onGifClick(props.gifId)}
    >
      <div className={props.isCopied ? "gif-item copied" : "gif-item"}>
        <img className="gif" src={gif.thumbnailUrl} />
        <div className="copy-indication">Copied!</div>
        <div className="overlay"></div>
      </div>
    </CopyToClipboard>
  );
};

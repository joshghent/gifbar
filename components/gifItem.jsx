import PropTypes from 'prop-types';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const GifItem = ({ gif, onGifClick, gifId, isCopied }) => (
    <CopyToClipboard text={gif.originalUrl} onCopy={() => onGifClick(gifId)}>
        <div className={isCopied ? 'gif-item copied' : 'gif-item'}>
            <img className="gif" src={gif.thumbnailUrl} alt="" />
            <div className="copy-indication">Copied!</div>
            <div className="overlay" />
        </div>
    </CopyToClipboard>
);
GifItem.propTypes = {
    gif: PropTypes.shape({
        originalUrl: PropTypes.string.isRequired,
        thumbnailUrl: PropTypes.string.isRequired,
    }),
    onGifClick: PropTypes.func.isRequired,
    gifId: PropTypes.number.isRequired,
    isCopied: PropTypes.bool,
};

export default GifItem;

import React, { useState, useEffect } from 'react';
import Spinner from "./spinner.js";
import isEmpty  from "lodash.isEmpty";
import dotenv from "dotenv";
import GifList from "./gifList.js";

import {GiphyGifProvider, TenorGifProvider, CompositeGifProvider} from "@jych/gif-provider";

// todo the API keys should not be in the git repo
const giphyGifProvider = new GiphyGifProvider('bH5Z69mu6KFkaxvRmNgi1kPtL02Cemin');
const tenorGifProvider = new TenorGifProvider('Y91ZIZBKZ3DL');
const gifProvider = new CompositeGifProvider([giphyGifProvider, tenorGifProvider]);

dotenv.config();
const WAIT_INTERVAL = 1000;

const GifBox = () => {
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(null);
  const [typing, setTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [gifs, setGifs] = useState([]);

  useEffect(() => {
    gifProvider.trending(30).then((gifsArr) => {
      setGifs(gifsArr);
    });
  }, []);

  const handleGifClick = (gifId) => {
    setGifs(gifId);
  };

  const searchGifs = (query) => {
    if (query === '') {
      gifProvider.trending(30).then((gifsArr) => {
        setGifs(gifsArr);
      });
    } else {
      gifProvider.search(query, 30).then((gifsArr) => {
        setGifs(gifsArr);
      });
    }
  };

  const triggerSearch = () => {
    setCopied(null);
    searchGifs(value);
  };

  const handleChange = (e) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setValue(e.target.value);
    setTyping(false);
    setTypingTimeout(setTimeout(() => {
      triggerSearch();
    }, WAIT_INTERVAL));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  };

  let content = null;

  if (isEmpty(gifs)) {
    content = <Spinner />;
  } else {
    content = (
      <GifList
        gifs={gifs}
        copied={copied}
        onSearch={searchGifs}
        handleGifClick={handleGifClick}
      />
    );
  }

  return (
    <>
      <input
        type="text"
        className="search-input"
        placeholder="🔍 Search GIFs"
        onChange={(e) => handleChange(e)}
        onKeyPress={(e) => handleKeyPress(e)}
      />
      {content}
    </>
  );
};

export default GifBox;

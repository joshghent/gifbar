import React from "react";
import Spinner from "./spinner.js";
import isEmpty from "lodash.isEmpty";
import dotenv from "dotenv";
import GifList from "./gifList.js";

import {
  GiphyGifProvider,
  TenorGifProvider,
  CompositeGifProvider,
} from "@jych/gif-provider";

// todo the API keys should not be in the git repo
const giphyGifProvider = new GiphyGifProvider(
  "bH5Z69mu6KFkaxvRmNgi1kPtL02Cemin"
);
const tenorGifProvider = new TenorGifProvider("Y91ZIZBKZ3DL");
const gifProvider = new CompositeGifProvider([
  giphyGifProvider,
  tenorGifProvider,
]);

dotenv.config();
const WAIT_INTERVAL = 1000;

export default () => {
  const [value, setValue] = React.useState("");
  const [copied, setCopied] = React.useState(null);
  const [typing, setTyping] = React.useState(false);
  const [typingTimeout, setTypingTimeout] = React.useState(0);
  const [gifs, setGifs] = React.useState([]);

  React.useEffect(() => {
    gifProvider.trending(30).then(newGifs => {
      setGifs(newGifs);
    });
  });

  const handleGifClick = gifId => setCopied(gifId);

  function searchGifs(query) {
    if (query === "") {
      gifProvider.trending(30).then(newGifs => {
        setGifs(newGifs);
      });
    } else {
      gifProvider.search(query, 30).then(newGifs => {
        setGifs(newGifs);
      });
    }
  }

  function triggerSearch() {
    setCopied(null);
    searchGifs(value);
  }

  function handleChange(e) {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setValue(e.target.value);
    setTyping(false);
    setTypingTimeout(
      setTimeout(() => {
        triggerSearch();
      }, WAIT_INTERVAL)
    );
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      triggerSearch();
    }
  }

  let content = null;
  if (isEmpty(gifs)) {
    content = <Spinner />;
  } else {
    content = (
      <GifList
        gifs={gifs}
        copied={copied}
        onSearch={() => searchGifs()}
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
        onChange={e => handleChange(e)}
        onKeyPress={e => handleKeyPress(e)}
      />
      {content}
    </>
  );
};

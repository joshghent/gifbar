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

// export default class GifBox extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       value: '',
//       copied: null,
//       typing: false,
//       typingTimeout: 0,
//       gifs: [], // an array of Gifs (from gif-provider)
//     };

//     this.searchGifs = this.searchGifs.bind(this);
//     this.handleChange = this.handleChange.bind(this);
//     this.triggerSearch = this.triggerSearch.bind(this);
//     this.handleGifClick = this.handleGifClick.bind(this);
//     this.handleKeyPress = this.handleKeyPress.bind(this);
//   }

//   handleGifClick(gifId) {
//     this.setState({ copied: gifId });
//   }

//   handleChange(e) {
//     if (this.state.typingTimeout) {
//       clearTimeout(this.state.typingTimeout);
//     }

//     this.setState({
//       value: e.target.value,
//       typing: false,
//       typingTimeout: setTimeout(() => {
//         this.triggerSearch();
//       }, WAIT_INTERVAL),
//     });
//   }

//   handleKeyPress(e) {
//     if (e.key === 'Enter') {
//       this.triggerSearch();
//     }
//   }

//   triggerSearch() {
//     const { value } = this.state;
//     this.setState({ copied: null });
//     this.searchGifs(value);
//   }

//   searchGifs(query) {
//     if (query === '') {
//       gifProvider.trending(30).then((gifs) => {
//         this.setState({ gifs });
//       });
//     } else {
//       gifProvider.search(query, 30).then((gifs) => {
//         this.setState({ gifs });
//       });
//     }
//   }

//   componentDidMount() {
//     gifProvider.trending(30).then((gifs) => {
//       this.setState({ gifs });
//     });
//   }

//   render() {
//     let content = null;
//     if (isEmpty(this.state.gifs)) {
//       content = <Spinner />;
//     } else {
//       content = (
//         <GifList
//           gifs={this.state.gifs}
//           copied={this.state.copied}
//           onSearch={this.searchGifs}
//           handleGifClick={this.handleGifClick}
//         />
//       );
//     }

//     return (
//       <Fragment>
//         <input
//           type="text"
//           className="search-input"
//           placeholder="🔍 Search GIFs"
//           onChange={this.handleChange}
//           onKeyPress={this.handleKeyPress}
//         />
//         {content}
//       </Fragment>
//     );
//   }
// }

const GifBox = () => {
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(null);
  const [typing, setTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [gifs, setGifs] = useState([]);

  useEffect(() => {
    gifProvider.trending(30).then((arr) => {
      setGifs(arr);
    });
  }, []);

  const handleGifClick = (gifId) => {
    setGifs(gifId);
  };

  const searchGifs = (query) => {
    if (query === '') {
      gifProvider.trending(30).then((arr) => {
        setGifs(arr);
      });
    } else {
      gifProvider.search(query, 30).then((arr) => {
        setGifs(arr);
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

import React from 'react';
import map from 'lodash.map';
import GifItem from './gifItem';

export default class GifList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const gifNodes = map(this.props.gifs, (gif, index) => (
      <GifItem
        gif={gif}
        key={index}
        gifId={index}
        onGifClick={(gifId) => this.props.handleGifClick(gifId)}
        isCopied={this.props.copied === index}
      />
    ));

    return (
      <div>
        <img src="./../assets/giphy-mark.png" className="giphy-watermark" />
        <div className="gif-list">{gifNodes}</div>
      </div>
    );
  }
}

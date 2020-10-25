import React from 'react';
import GifItem from './gifItem.jsx';
import  map from 'lodash.map';

export default class GifList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const gifNodes = map(this.props.gifs, (gif, index) => {
			return (
				<GifItem
					gif={gif}
					key={index}
					gifId={index}
					onGifClick={(gifId) => this.props.handleGifClick(gifId)}
					isCopied={this.props.copied === index}
				/>
			);
		});

		return (
			<div>
				<img src='./../assets/giphy-mark.png' className='giphy-watermark' />
				<div className='gif-list'>{gifNodes}</div>
			</div>
		);
	}
}

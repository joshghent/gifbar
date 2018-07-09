import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default class GifItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const gif = this.props.gif;

		return (
			<CopyToClipboard text={gif.images.original.url} onCopy={() => this.props.onGifClick(this.props.gifId)}>
				<div className={ this.props.isCopied ? 'gif-item copied' : 'gif-item' }>
					<img className='gif' src={gif.images.fixed_width_small.url}/>
					<div className="copy-indication">Copied!</div>
					<div className="overlay"></div>
				</div>
			</CopyToClipboard>
		)
	}
}

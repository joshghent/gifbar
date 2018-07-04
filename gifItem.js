import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default class GifItem extends React.Component {
	render() {
		const gif = this.props.gif;

		return (
			<CopyToClipboard text={gif.images.original.url}>
				<div className='gif-item'>
					<img className='gif' src={gif.images.original.url}/>
				</div>
			</CopyToClipboard>
		)
	}
}

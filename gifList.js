import React from 'react';
import GifItem from './gifItem.js';
import { map } from 'lodash';

export default class GifList extends React.Component {

	onSearch(e) {
		if (e.key === 'Enter') {
			this.props.onSearch(e.target.value);
		}
	}

	render() {
		const gifNodes = map(this.props.gifs, (gif, index) => {
			return (
				<GifItem gif={gif}/>
			);
		})

		return (
			<div>
				<input onKeyPress={(e) => this.onSearch(e)} type='text' className='search-input' placeholder='Search GIFs'/>
				<div className='gif-list'>
					{gifNodes}
				</div>
			</div>
		);
	}
}

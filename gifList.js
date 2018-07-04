import React from 'react';
import GifItem from './gifItem.js';
import { debounce, map } from 'lodash';

export default class GifList extends React.Component {

	onSearch(e) {
		if (e.key === 'Enter') {
			this.props.onSearch(e.target.value);
		}
	}

	render() {
		const gifNodes = map(this.props.gifs, (gif, index) => {
			return (
				<li key={index}>
					<GifItem gif={gif}/>
				</li>
			);
		})

		return (
			<div>
				<input onKeyPress={(e) => this.onSearch(e)} type='text'/>
				<ul className='gif-list'>
					{gifNodes}
				</ul>
			</div>
		);
	}
}

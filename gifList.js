import React from 'react';
import GifItem from './gifItem.js';
import { map } from 'lodash';

export default class GifList extends React.Component {
	render() {
		const gifNodes = map(this.props.gifs, (gif, index) => {
			return (
				<li key={index}>
					<GifItem gif={gif}/>
				</li>
			);
		})

		return (
			<ul className='gif-list'>
				{gifNodes}
			</ul>
		);
	}
}

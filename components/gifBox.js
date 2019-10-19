import React, { Fragment } from 'react';
import Spinner from './spinner.js';
import { isEmpty } from 'lodash';
const giphy = require('giphy-api')('bH5Z69mu6KFkaxvRmNgi1kPtL02Cemin');
import dotenv from 'dotenv';
import GifList from './gifList.js';

dotenv.config();
const WAIT_INTERVAL = 1000;

export default class GifBox extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value         : '',
			copied        : null,
			typing        : false,
			typingTimeout : 0,
			gifs          : []
		};

		this.searchGifs = this.searchGifs.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.triggerSearch = this.triggerSearch.bind(this);
		this.handleGifClick = this.handleGifClick.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	handleGifClick(gifId) {
		this.setState({ copied: gifId });
	}

	handleChange(e) {
		if (this.state.typingTimeout) {
			clearTimeout(this.state.typingTimeout);
		}

		this.setState({
			value         : e.target.value,
			typing        : false,
			typingTimeout : setTimeout(() => {
				this.triggerSearch();
			}, WAIT_INTERVAL)
		});
	}

	handleKeyPress(e) {
		if (e.key === 'Enter') this.triggerSearch();
	}

	triggerSearch() {
		const { value } = this.state;
		this.setState({ copied: null });
		this.searchGifs(value);
	}

	searchGifs(query) {
		if (query === '') {
			giphy.trending({ limit: 30 }).then((res) => {
				this.setState({ gifs: res.data });
			});
		} else {
			giphy.search({ q: query, limit: 30 }).then((res) => {
				this.setState({ gifs: res.data });
			});
		}
	}

	componentDidMount() {
		giphy.trending({ limit: 30 }).then((res) => {
			this.setState({ gifs: res.data });
		});
	}

	render() {
		let content = null;
		if (isEmpty(this.state.gifs)) {
			content = <Spinner />;
		} else {
			content = (
				<GifList
					gifs={this.state.gifs}
					copied={this.state.copied}
					onSearch={this.searchGifs}
					handleGifClick={this.handleGifClick}
				/>
			);
		}

		return (
			<Fragment>
				<input
					type='text'
					className='search-input'
					placeholder='🔍 Search GIFs'
					onChange={this.handleChange}
					onKeyPress={this.handleKeyPress}
				/>
				{content}
			</Fragment>
		);
	}
}

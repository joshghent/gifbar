import React from 'react';
import Spinner from './spinner.js';
import { isEmpty } from 'lodash';
const giphy = require('giphy-api')('bH5Z69mu6KFkaxvRmNgi1kPtL02Cemin')
import dotenv from 'dotenv';
import GifList from './GifList.js';

dotenv.config();

export default class GifBox extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			gifs: [],
		};
	}

	componentDidMount() {
		giphy.trending({ limit: 30 }).then((res) => {
			this.setState({ gifs: res.data });
		})
	}

	searchGifs(query) {
		if (query === '') {
			giphy.trending({ limit: 30 }).then((res) => {
				this.setState({ gifs: res.data });
			})
		} else {
			giphy.search({ q: query, limit: 30 }).then((res) => {
				this.setState({ gifs: res.data })
			});
		}
	}

	render() {
		let content = null;
		if (isEmpty(this.state.gifs)) {
			content = <Spinner />
		} else {
			content = <GifList gifs={this.state.gifs} onSearch={this.searchGifs.bind(this)}/>
		}

		return content;
	}
}

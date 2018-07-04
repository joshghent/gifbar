import React from 'react';
import Spinner from './spinner.js';
import { isEmpty } from 'lodash';
const giphy = require('giphy-api')(process.env.GIPHY_API)
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
		console.log("Made It!");

		giphy.trending().then((res) => {
			this.setState({ gifs: res.data });
			console.log(res);
		})
	}

	onGifClick() {}

	render() {
		let content = null;
		if (isEmpty(this.state.gifs)) {
			content = <Spinner />
		} else {
			content = <GifList gifs={this.state.gifs}/>
		}

		return content;
	}
}

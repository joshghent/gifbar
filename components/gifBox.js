import React from "react";
import Spinner from "./spinner.js";
import { isEmpty } from "lodash";
import dotenv from "dotenv";
import GifList from "./gifList.js";

const GifProviderWrapper = require("../lib/GifProvider/GifProviderWrapper");
const { getProviders } = require("../lib/GifProvider/GifProviderFactory");

const gifProvider = new GifProviderWrapper(getProviders([ "giphy" ]));

dotenv.config();

export default class GifBox extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			gifs: [],
		};
	}

	componentDidMount() {
		gifProvider.trending(30).then((res) => {
			this.setState({ gifs: res.data });
		});
	}

	searchGifs(query) {
		if (query === "") {
			gifProvider.trending(30).then((res) => {
				this.setState({ gifs: res.data });
			});
		} else {
			gifProvider.search(query, 30).then((res) => {
				this.setState({ gifs: res.data });
			});
		}
	}

	render() {
		let content = null;
		if (isEmpty(this.state.gifs)) {
			content = <Spinner />;
		} else {
			content = <GifList gifs={this.state.gifs} onSearch={this.searchGifs.bind(this)}/>;
		}

		return content;
	}
}

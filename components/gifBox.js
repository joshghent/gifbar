import React from "react";
import Spinner from "./spinner.js";
import { isEmpty } from "lodash";
import dotenv from "dotenv";
import GifList from "./gifList.js";

import {GiphyGifProvider, TenorGifProvider, CompositeGifProvider} from "@jych/gif-provider";

// todo the API keys should not be in the git repo
const giphyGifProvider = new GiphyGifProvider("bH5Z69mu6KFkaxvRmNgi1kPtL02Cemin");
const tenorGifProvider = new TenorGifProvider("Y91ZIZBKZ3DL");
const gifProvider = new CompositeGifProvider([ giphyGifProvider, tenorGifProvider ]);

dotenv.config();

export default class GifBox extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			gifs: [], // an array of Gifs (from gif-provider)
		};
	}

	componentDidMount() {
		gifProvider.trending(30).then((gifs) => {
			this.setState({ gifs });
		})
	}

	searchGifs(query) {
		if (query === "") {
			gifProvider.trending(30).then((gifs) => {
				this.setState({ gifs });
			})
		} else {
			gifProvider.search(query, 30).then((gifs) => {
				this.setState({ gifs });
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

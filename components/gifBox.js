
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
const WAIT_INTERVAL = 1000;

export default class GifBox extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value         : "",
			copied        : null,
			typing        : false,
			typingTimeout : 0,
			gifs          : [], // an array of Gifs (from gif-provider)
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
		if (e.key === "Enter") {
			this.triggerSearch();
		}
	}

	triggerSearch() {
		const { value } = this.state;
		this.setState({ copied: null });
		this.searchGifs(value);
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
        
  componentDidMount() {
		gifProvider.trending(30).then((gifs) => {
			this.setState({ gifs });
		})
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

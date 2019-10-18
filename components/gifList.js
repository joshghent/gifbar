import React from "react";
import GifItem from "./gifItem.js";
import { map } from "lodash";

const WAIT_INTERVAL = 1000;

export default class GifList extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);

		this.state = {
			value: "",
			typing: false,
			typingTimeout: 0,
			copied: null,
		};
	}

	handleChange(e) {
		if (this.state.typingTimeout) {
			clearTimeout(this.state.typingTimeout);
		}

		this.setState({
			value: e.target.value,
			typing: false,
			typingTimeout: setTimeout(() => { this.triggerSearch(); }, WAIT_INTERVAL),
		});
	}

	triggerSearch() {
		const { value } = this.state;
		this.setState({ copied: null });
		this.props.onSearch(value);
	}

	handleKeyPress(e) {
		if (e.key === "Enter") {
			this.triggerSearch();
		}
	}

	handleGifClick(gifId) {
		this.setState({ copied: gifId });
	}

	render() {
		const gifNodes = map(this.props.gifs, (gif, index) => {
			return (
				<GifItem gif={gif} key={index} gifId={index} onGifClick={(gifId) => this.handleGifClick(gifId)} isCopied={ this.state.copied === index }/>
			);
		});

		return (
			<div>
				<input onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleChange} type='text' className='search-input' placeholder='🔍 Search GIFs'/>
				<img src="./../assets/giphy-mark.png" className="giphy-watermark"/>
				<div className='gif-list'>
					{gifNodes}
				</div>
			</div>
		);
	}
}

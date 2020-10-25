import React from 'react';
import ReactLoading from 'react-loading';

export default class Spinner extends React.Component {
	render() {
		return (
			<div className='spinner'>
				<ReactLoading type='bars' />
			</div>
		);
	}
}

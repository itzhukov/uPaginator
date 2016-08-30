'use strict'

import React from "react";
import ReactDOM from "react-dom";
import UPaginator from 'UPaginator';

class App extends React.Component {
	constructor() {
		super();
	}

	render() {
		return (
			<UPaginator pageCurrent={25} pageCount={58} />
		);
	}
}

ReactDOM.render(<App />, document.querySelector('#App') );

/* ================================= exports ================================= */

module.exports = {

}

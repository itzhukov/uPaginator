'use strict'

import UPaginator from "./uPaginator.js";

var uPaginator = new UPaginator;

uPaginator.setData({
	renderSelector: '.uPaginator',
	page_count: 50,
	page_current: 3,
	onchange: function (uPaginator) {
		let page_count = uPaginator.data.page_count;
		let page_current = uPaginator.data.page_current;
		let page_current_prev = uPaginator.data.page_current_prev;

		console.log('page: ', page_current, '/', page_count);
	}
});

/* ================================= exports ================================= */

module.exports = {

}

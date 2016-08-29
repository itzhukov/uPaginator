export default class UPaginator {
	constructor() {
		this.data = {
			renderSelector: null,
			renderElement: null,
			onchange: null,
			rendered: false,
			binded: false,
			page_count: 0,
			page_current: 0,
			page_current_prev: 0,
		};
	}

	// Получить данные
	getData(option){
		// console.info('-> UPaginator getData');

		if (option) {
			switch(typeof option){
				case 'string': return this.data[option];

				case 'object':
					let optionsObject = {};
					let optionLen = option.length;

					for (let x=0; x < optionLen; x++) optionsObject[ option[x] ] =  this.data[option[x]];

					return optionsObject;

				default: return this.data;
			}
		} else {
			return this.data;
		}
	}

	// Записать данные
	setData(options){
		// console.info('-> UPaginator setData');

		for (let opt in options){
			switch(typeof options[opt]){
				case 'function':
				case 'number':
				case 'string': this.data[opt] = options[opt]; break;
				case 'object':
					if ( Array.isArray(options[opt]) ){
						this.data[opt] = options[opt];
					} else {
						this.data[opt] = { ...this.data[opt], ...options[opt] };
					}
					break;
				default: console.error('Передан неизвестнный тип опций', options[opt] ); break;
			}
		}
		this.checkState();
	}

	checkState(){
		// console.info( '-> UPaginator checkState');

		let renderSelector = (this.data.renderSelector !== null) ? document.querySelectorAll(this.data.renderSelector) : 0;

		if (renderSelector.length) {
			this.data.renderElement = renderSelector[0];
		}

		if ( this.data.renderElement !== null){
			this.render();
			if ( this.data.binded === false) this.bindEvents();
		}

		// this.stateData();
	}

	bindEvents(){
		// console.trace("-> bindEvents");

		this.data.binded = true;

		this.data.renderElement.addEventListener("click", (event) => {
			event.preventDefault()
			event.stopPropagation();

			if (new RegExp('\\buPaginator-page\\b').test(event.target.className) ){
				let data = event.target.dataset;
				let direction = data.direction || null;
				let page = data.page || null;
				let page_count = this.data.page_count;
				let page_current = this.data.page_current;

				if (direction) {
					if (direction == 'prev') {
						if (--page_current != 0) {
							this.setData({
								page_current: page_current
							});
						}
					} else {
						if (++page_current <= page_count) {
							this.setData({
								page_current: page_current
							});
						}
					}
				} else if (page) {
					if (page != page_current){
						this.setData({
							page_current: page
						});
					}
				}
			}

			if (event.target.tagName === 'SPAN'){
				event.target.parentNode.click();
			}

		}, false);
	}

	render(){
		let page_count = this.data.page_count;
		let page_current = this.data.page_current;
		let page_current_prev = this.data.page_current_prev;

		if (page_count != page_current_prev){
			this.data.page_current_prev = page_current;
			if (typeof this.data.onchange == 'function'){
				this.data.onchange(this);
			}
		}

		if (page_count){
			// documentFragment
			let df = document.createDocumentFragment();

			// pages
			let uPaginatorPages = document.createElement("div");
			uPaginatorPages.className = "uPaginator-pages";

			uPaginatorPages.appendChild( prevPage() );

			/* ================================================================== */
			if (page_count > 10) { // Кол-во страниц больше 10
				if (page_current < 10) { // Текущая стрнаица в первой десятке
					// console.info('Текущая стрнаица в первой десятке');

					// first 10 each page
					for (let i=1; i<=9; i++){
						let page = document.createElement("div");
						page.className = "uPaginator-page";
						page.dataset.page = i;

						if (page_current == i) page.classList.add("uPaginator-page--active");

						// span
						let span = document.createElement("span");
						span.className = "uPaginator-num";
						span.textContent = i;

						page.appendChild(span);
						uPaginatorPages.appendChild(page);
						df.appendChild(uPaginatorPages);
					}

					uPaginatorPages.appendChild( nextEllipsisPage() );
					uPaginatorPages.appendChild( lastPage() );
				} else if (page_current >= page_count-8) { // Текущая стрнаица в последней десятке
					// console.info('Текущая стрнаица в последней десятке');

					uPaginatorPages.appendChild( firstPage() );
					uPaginatorPages.appendChild( prevEllipsisPage() );

					// last 10 each page
					for (let i=page_count-8; i<=page_count; i++){
						let page = document.createElement("div");
						page.className = "uPaginator-page";
						page.dataset.page = i;

						if (page_current == i) page.classList.add("uPaginator-page--active");

						// span
						let span = document.createElement("span");
						span.className = "uPaginator-num";
						span.textContent = i;

						page.appendChild(span);
						uPaginatorPages.appendChild(page);
						df.appendChild(uPaginatorPages);
					}
				} else { // Текущая стрнаица в середине списка страниц
					// console.info('Текущая стрнаица в середине списка страниц');

					uPaginatorPages.appendChild( firstPage() );
					uPaginatorPages.appendChild( prevEllipsisPage() );

					// each page
					for (let start=page_current-=5, end=page_current+=5, i=start; i<=end; i++){
						let page = document.createElement("div");
						page.className = "uPaginator-page";
						page.dataset.page = i;

						if (page_current == i) page.classList.add("uPaginator-page--active");

						// span
						let span = document.createElement("span");
						span.className = "uPaginator-num";
						span.textContent = i;

						page.appendChild(span);
						uPaginatorPages.appendChild(page);
						df.appendChild(uPaginatorPages);
					}

					uPaginatorPages.appendChild( nextEllipsisPage() );
					uPaginatorPages.appendChild( lastPage() );
				}
			} else { // Кол-во страниц меньше 10
				// each page
				for (let i=1; i<=page_count; i++){
					let page = document.createElement("div");

					page.className = "uPaginator-page";
					if (page_current == i) page.classList.add("uPaginator-page--active");

					// span
					let span = document.createElement("span");

					span.className = "uPaginator-num";
					span.textContent = i;

					page.appendChild(span);
				}
			}

			/* ================================================================== */

			df.appendChild(uPaginatorPages);

			uPaginatorPages.appendChild( nextPage() );

			this.data.renderElement.innerHTML = '';
			this.data.renderElement.appendChild(df);
		}

		function prevPage(event) {
			// prev page <
			let prevPage = document.createElement("div");
			prevPage.className = "uPaginator-page uPaginator-page--prev";
			prevPage.dataset.direction = "prev";

			let prevSpan = document.createElement("span");
			prevSpan.className = "uPaginator-prev";
			prevPage.appendChild(prevSpan);

			return prevPage;
		}

		function nextPage(event) {
			// next page >
			let nextPage = document.createElement("div");
			nextPage.className = "uPaginator-page uPaginator-page--next";
			nextPage.dataset.direction = "next";

			let nextSpan = document.createElement("span");
			nextSpan.className = "uPaginator-next";
			nextPage.appendChild(nextSpan);

			return nextPage;
		}

		function firstPage(event) {
			// first page
			let firstPage = document.createElement("div");
			firstPage.className = "uPaginator-page";
			firstPage.dataset.page = 1;

			let firstPageSpan = document.createElement("span");
			firstPageSpan.className = "uPaginator-num";
			firstPageSpan.textContent = 1;
			firstPage.appendChild(firstPageSpan);

			return firstPage;
		}

		function lastPage(event) {
			let lastPage = document.createElement("div");
			lastPage.className = "uPaginator-page";
			lastPage.dataset.page = page_count;

			let lastPageSpan = document.createElement("span");
			lastPageSpan.className = "uPaginator-num";
			lastPageSpan.textContent = page_count;
			lastPage.appendChild(lastPageSpan);

			return lastPage;
		}

		function nextEllipsisPage(event) {
			// ellipsis
			let nextEllipsisPage = document.createElement("div");
			nextEllipsisPage.className = "uPaginator-page uPaginator-page--prev";
			nextEllipsisPage.dataset.direction = "next";

			let nextEllipsisSpan = document.createElement("span");
			nextEllipsisSpan.className = "uPaginator-ellipsis";
			nextEllipsisSpan.textContent = '...';
			nextEllipsisPage.appendChild(nextEllipsisSpan);

			return nextEllipsisPage;
		}

		function prevEllipsisPage(event) {
			// ellipsis
			let prevEllipsisPage = document.createElement("div");
			prevEllipsisPage.className = "uPaginator-page uPaginator-page--prev";
			prevEllipsisPage.dataset.direction = "prev";

			let prevEllipsisSpan = document.createElement("span");
			prevEllipsisSpan.className = "uPaginator-ellipsis";
			prevEllipsisSpan.textContent = '...';
			prevEllipsisPage.appendChild(prevEllipsisSpan);

			return prevEllipsisPage;
		}
	}

	stateData(){
		// console.info( '-> UPaginator stateData: ', this.data);
	}
}

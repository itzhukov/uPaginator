import React from "react";

export default class UPaginator extends React.Component {
	constructor() {
		super();

		this.state = {
			pageCurrent: 0
		}
	}

	componentDidMount(event) {
		this.setState({
			pageCurrent: this.props.pageCurrent
		});
	}

	choosePage(event) {
		event.preventDefault()
		event.stopPropagation();

		if (new RegExp('uPaginator-page').test(event.target.className) ){
			let data = event.target.dataset;
			let direction = data.direction || null;
			let page = data.page || null;
			let pageCount = this.props.pageCount;

			let pageCurrent = this.state.pageCurrent;

			if (direction) {
				if (direction == 'prev') {
					if (--pageCurrent != 0) {
						this.setState({
							pageCurrent: pageCurrent
						});
					}
				} else if (direction == 'next') {
					if (++pageCurrent <= pageCount) {
						this.setState({
							pageCurrent: pageCurrent
						});
					}
				}
			} else if (page) {
				if (page != pageCurrent){
					this.setState({
						pageCurrent: page
					});
				}
			}
		}

		if (new RegExp('(uPaginator-num|uPaginator-ellipsis|uPaginator-next|uPaginator-prev)').test(event.target.className) ){
			event.target.parentNode.click();
		}
	}

	render() {
		let pages = [];
		let pageCount = this.props.pageCount;
		let pageCurrent = this.state.pageCurrent;
		let activePageClass = "uPaginator-page uPaginator-page--active";
		let nonActivePageClass = "uPaginator-page";
		let nextPageClass = "uPaginator-page uPaginator-page--next";
		let prevPageClass = "uPaginator-page uPaginator-page--prev";
		let ellipsisClass = "uPaginator-ellipsis";
		let numClass = "uPaginator-num";

		if (pageCount > 10) { // Кол-во страниц больше 10
			if (pageCurrent < 10) { // Текущая стрнаица в первой десятке

				for (let i = 1; i <= 9; i++) {
					pages.push(<div className={ (pageCurrent == i) ? activePageClass : nonActivePageClass } data-page={i}>
						<span className={numClass}>{i}</span>
					</div>);
				}

				pages.push(<div className={nextPageClass} data-direction="next">
					<span className={ellipsisClass}>...</span>
				</div>);

				pages.push(<div className={ (pageCurrent == pageCount) ? activePageClass : nonActivePageClass } data-page={pageCount}>
					<span className={numClass}>{pageCount}</span>
				</div>);

			} else if (pageCurrent >= pageCount-8) { // Текущая стрнаица в последней десятке

				pages.push(<div  className={ (pageCurrent == 1) ? activePageClass : nonActivePageClass } data-page={1}>
					<span className={numClass}>{1}</span>
				</div>);

				pages.push(<div className={prevPageClass} data-direction="prev">
					<span className={ellipsisClass}>...</span>
				</div>);

				for (let i = pageCount-8; i <= pageCount; i++) {
					pages.push(<div  className={ (pageCurrent == i) ? activePageClass : nonActivePageClass } data-page={i}>
						<span className={numClass}>{i}</span>
					</div>);
				}

			} else { // Текущая стрнаица в середине списка страниц
				pages.push(<div className={ (pageCurrent == 1) ? activePageClass : nonActivePageClass } data-page={1}>
					<span className={numClass}>{1}</span>
				</div>);

				pages.push(<div className={prevPageClass} data-direction="prev">
					<span className={ellipsisClass}>...</span>
				</div>);

				for (let start = +pageCurrent-4, end = +pageCurrent+4, i = start; i <= end; i++) {
					pages.push(<div className={ (pageCurrent == i) ? activePageClass : nonActivePageClass } data-page={i}>
						<span className={numClass}>{i}</span>
					</div>);
				}

				pages.push(<div className={nextPageClass} data-direction="next">
					<span className={ellipsisClass}>...</span>
				</div>);

				pages.push(<div className={ (pageCurrent == pageCount) ? activePageClass : nonActivePageClass } data-page={pageCount}>
					<span className={numClass}>{pageCount}</span>
				</div>);
			}

		} else { // Кол-во страниц меньше 10
			for (let i = 1; i <= pageCount; i++) {
				pages.push(
					<div className={ (pageCurrent == i) ? activePageClass : nonActivePageClass } data-page={i}>
						<span className={numClass}>{i}</span>
					</div>
				);
			}
		}

		return (
			<div className="uPaginator">
				<div className="uPaginator-pages" onClick={this.choosePage.bind(this)}>
					<div className={prevPageClass} data-direction="prev">
						<span className="uPaginator-prev"></span>
					</div>
					{
						pages.map( (item, i) => {
							return <span key={i}>{item}</span>
						})
					}
					<div className={nextPageClass} data-direction="next">
						<span className="uPaginator-next"></span>
					</div>
				</div>
			</div>
		)
	}
}
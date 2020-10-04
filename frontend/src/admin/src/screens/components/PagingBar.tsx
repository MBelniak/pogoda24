import React from 'react';
import ReactPaginate from 'react-paginate';

interface PagingBarProps {
    pages: number;
    handlePageClick: (data) => void;
    currentPage: number;
}

export class PagingBar extends React.Component<PagingBarProps> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const elements = document.querySelectorAll(".pagingBar li a");
        elements.forEach(element => {
            element.addEventListener("click", () => {
                setTimeout(() => {
                    (element as HTMLElement).blur();
                }, 500);
            })
        });
    }


    render() {
        return (
            <div className="pagination">
                <ReactPaginate
                    previousLabel={<i className={"fa fa-angle-left"}/>}
                    nextLabel={<i className={"fa fa-angle-right"}/>}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.props.pages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={1}
                    onPageChange={this.props.handlePageClick}
                    containerClassName={'pagingBar fontSizeLarge'}
                    subContainerClassName={'pagingBarSub'}
                    activeClassName={'active'}
                    previousLinkClassName={'pagingBarPrevious'}
                    nextLinkClassName={'pagingBarNext'}
                    forcePage={this.props.currentPage}
                />
            </div>
        );
    }
}

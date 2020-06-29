import React from 'react';
import ReactPaginate from 'react-paginate';
import './PagingBar.scss';

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
        let elements = document.querySelectorAll(".pagingBar li");
        elements.forEach(element => {
            element.addEventListener("click", () => {
                if (element.firstChild) {
                    (element.firstChild as HTMLElement).click();
                }
            })
        });
        elements = document.querySelectorAll(".pagingBar li a");
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
                    previousLabel={'<'}
                    nextLabel={'>'}
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

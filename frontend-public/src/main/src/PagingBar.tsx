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

    render() {
        return (
            <div className="pagination">
                <ReactPaginate
                    previousLabel={'Poprzednie'}
                    nextLabel={'Następne'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.props.pages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={1}
                    onPageChange={this.props.handlePageClick}
                    containerClassName={'pagingBar'}
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

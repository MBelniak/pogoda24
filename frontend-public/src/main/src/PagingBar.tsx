import React from 'react';
import ReactPaginate from 'react-paginate';

interface PagingBarProps {
    pages: number;
    handlePageClick: (data) => void
}

export class PagingBar extends React.Component<PagingBarProps> {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <ReactPaginate
                    previousLabel={'< Poprzednie'}
                    nextLabel={'Następne'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.props.pages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={4}
                    onPageChange={this.props.handlePageClick}
                    containerClassName={'pagingBar'}
                    subContainerClassName={'pagingBarSub'}
                    activeClassName={'active'}
                    previousLinkClassName={'pagingBarPrevious'}/>
            </div>
        )
    }
}
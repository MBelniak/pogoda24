import React from 'react';
import ReactPaginate from 'react-paginate';
import styles from '../scss/main.scss';
import styled from 'styled-components';

interface PagingBarProps {
    pages: number;
    handlePageClick: (data) => void;
    currentPage: number;
    mainColor: string;
    shadowColor: string;
    fontColor?: string;
    className?: string;
}

class DefaultPagingBar extends React.Component<PagingBarProps> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="pagination">
                <ReactPaginate
                    previousLabel={<i className={'fa fa-angle-left'} />}
                    nextLabel={<i className={'fa fa-angle-right'} />}
                    breakLabel={'...'}
                    pageCount={this.props.pages}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={1}
                    onPageChange={this.props.handlePageClick}
                    containerClassName={`${this.props.className} ${styles.fontSizeLarge} pagingBar`}
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

const PagingBar = styled(DefaultPagingBar)<PagingBarProps>`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 2rem 0 0.7rem 0;

    li {
        place-items: center;
        border-radius: 0.3rem;
        box-shadow: 0 0 3px ${props => props.shadowColor};
        margin: 0.6rem;
    }

    li a {
        padding: 5px 10px;
        transition: 0.3s;
    }

    li:hover {
        cursor: pointer;
    }

    li:hover a {
        transition: 0.3s;
    }

    .pagingBarPrevious i,
    .pagingBarNext i {
        margin: 0 5px;
    }

    .previous.disabled,
    .next.disabled {
        display: none;
    }

    li.active:hover,
    li.active:hover a {
        cursor: default;
    }

    .pagination {
        text-align: center;
    }

    .active {
        background-color: ${props => props.mainColor};
        box-shadow: 0 0 5px ${props => props.mainColor};
    }

    li a {
        color: ${props => props.fontColor || `black`};
    }

    li:hover a {
        color: ${props => props.mainColor};
    }
    li.active a,
    li.active:hover,
    li.active:hover a {
        color: ${props => props.fontColor || `black`};
    }
`;

export default PagingBar;

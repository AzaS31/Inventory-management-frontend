import { Pagination as BootstrapPagination } from "react-bootstrap";

export default function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages === 0) return null;

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page);
    };

    const paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <BootstrapPagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => goToPage(number)}
            >
                {number}
            </BootstrapPagination.Item>
        );
    }

    return (
        <div className="d-flex justify-content-end mt-1">
            <BootstrapPagination size="sm">
                <BootstrapPagination.Prev
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                {paginationItems}
                <BootstrapPagination.Next
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
            </BootstrapPagination>
        </div>
    );
}

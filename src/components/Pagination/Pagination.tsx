interface PaginationProps {
  currentPage: number;
  totalFiltered: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const Pagination = ({
  currentPage,
  totalFiltered,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const startItem = totalFiltered === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalFiltered);

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const delta = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  if (totalPages <= 0) return null;

  return (
    <div className="table-footer">
      <div className="footer-info">
        Hiển thị <strong>{startItem}</strong> – <strong>{endItem}</strong> trong{" "}
        <strong>{totalFiltered.toLocaleString()}</strong> người dùng
        &nbsp;&nbsp;|&nbsp;&nbsp;
        Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Hiển thị</span>
          <select
            className="page-size-select"
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>/ trang</span>
        </div>

        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            «
          </button>
          <button
            className="page-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {getPageNumbers().map((page, idx) =>
            page === "..." ? (
              <span key={`e-${idx}`} className="page-ellipsis">…</span>
            ) : (
              <button
                key={idx}
                className={`page-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </button>
            )
          )}

          <button
            className="page-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
          <button
            className="page-btn"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

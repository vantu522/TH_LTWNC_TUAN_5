interface TopHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const TopHeader = ({ searchTerm, onSearchChange }: TopHeaderProps) => {
  return (
    <header className="top-header">
      <div className="header-breadcrumb">
        <span className="breadcrumb-root">Trang chủ</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Quản lý người dùng</span>
      </div>

      <div className="header-actions">
        <div className="header-search">
          <input
            type="text"
            className="header-search-input"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button className="header-btn secondary">Xuất dữ liệu</button>
        <button className="header-btn primary">Thêm người dùng</button>
      </div>
    </header>
  );
};

export default TopHeader;

import { useState } from "react";
import useUsers from "./hooks/useUsers";
import Sidebar from "./components/Sidebar/Sidebar";
import TopHeader from "./components/TopHeader/TopHeader";
import UserStats from "./components/UserStats/UserStats";
import UserTable from "./components/UserTable/UserTable";
import UserDetailModal from "./components/UserDetailModal/UserDetailModal";
import Pagination from "./components/Pagination/Pagination";
import type { User } from "./types/user";
import "./App.css";




function App() {
  const {
    users,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    genderFilter,
    setGenderFilter,
    sortField,
    sortOrder,
    handleSortChange,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    selectedUsers,
    toggleSelectUser,
    selectAllPage,
    clearSelection,
    deleteSelected,
    deleteSingle,
    totalFiltered,
    paginatedUsers,
  } = useUsers();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (loading) {
    return (
      <div className="layout" style={{ alignItems: "center", justifyContent: "center" }}>
        <div className="table-loading">
          <div className="spinner"></div>
          <p>Đang tải 5.000 người dùng từ API...</p>
          <div className="loading-note">
            Phiên bản chưa tối ưu — tải toàn bộ dữ liệu một lần thay vì phân trang từ server
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h2>Lỗi tải dữ liệu</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Tải lại trang
        </button>
      </div>
    );
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <Sidebar totalUsers={users.length} />

      {/* Main area */}
      <div className="main-area">
        {/* Top header */}
        <TopHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* Page content */}
        <div className="page-content">
          {/* Page title */}
          <div className="page-title-row">
            <div>
              <h1 className="page-title">Danh sách người dùng</h1>
              <p className="page-desc">
                Quản lý toàn bộ {users.length.toLocaleString()} người dùng — phiên bản chưa được tối ưu hiệu năng
              </p>
            </div>
          </div>

          <UserStats users={users} />

          {/* Table card */}
          <div className="table-card">
            {/* Toolbar */}
            <div className="table-toolbar">
              <div className="table-toolbar-left">
                <span className="toolbar-title">Người dùng</span>
                <span className="toolbar-count">{totalFiltered.toLocaleString()} kết quả</span>
              </div>

              <div className="table-toolbar-right">
                <select
                  className="filter-select"
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="all">Tất cả giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>

                {selectedUsers.size > 0 && (
                  <>
                    <button className="btn btn-secondary" onClick={clearSelection}>
                      Bỏ chọn ({selectedUsers.size})
                    </button>
                    <button className="btn btn-danger" onClick={deleteSelected}>
                      Xóa {selectedUsers.size} người dùng
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Selection bar */}
            {selectedUsers.size > 0 && (
              <div className="selection-bar">
                <span className="selection-text">
                  Đã chọn {selectedUsers.size} / {totalFiltered.toLocaleString()} người dùng
                </span>
                <div className="selection-actions">
                  <button className="btn btn-secondary" onClick={clearSelection}>
                    Bỏ chọn tất cả
                  </button>
                  <button className="btn btn-danger" onClick={deleteSelected}>
                    Xóa đã chọn
                  </button>
                </div>
              </div>
            )}

            <UserTable
              users={paginatedUsers}
              selectedUsers={selectedUsers}
              onSelectUser={toggleSelectUser}
              onSelectAll={selectAllPage}
              onViewUser={(user) => setSelectedUser(user)}
              onDeleteUser={deleteSingle}
              sortField={sortField}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalFiltered={totalFiltered}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      </div>

      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}

export default App;

import { memo } from "react";

interface SidebarProps {
  totalUsers: number;
}

const Sidebar = memo(({ totalUsers }: SidebarProps) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">A</div>
        <div>
          <div className="brand-name">AdminPanel</div>
          <div className="brand-version">v2.0 — Đã tối ưu</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group-label">Tổng quan</div>
        <button className="nav-item">
          <span className="nav-item-dot"></span>
          Dashboard
        </button>
        <button className="nav-item">
          <span className="nav-item-dot"></span>
          Thống kê
        </button>

        <div className="nav-group-label">Quản lý</div>
        <button className="nav-item active">
          <span className="nav-item-dot"></span>
          Người dùng
          <span className="nav-item-count">{totalUsers.toLocaleString()}</span>
        </button>
        <button className="nav-item">
          <span className="nav-item-dot"></span>
          Vai trò
        </button>
        <button className="nav-item">
          <span className="nav-item-dot"></span>
          Phân quyền
        </button>

        <div className="nav-group-label">Hệ thống</div>
        <button className="nav-item">
          <span className="nav-item-dot"></span>
          Cài đặt
        </button>
        <button className="nav-item">
          <span className="nav-item-dot"></span>
          Nhật ký hoạt động
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-info">
          <div className="sidebar-avatar">A</div>
          <div>
            <div className="sidebar-user-name">Admin</div>
            <div className="sidebar-user-role">Quản trị viên</div>
          </div>
        </div>
      </div>
    </aside>
  );
});

export default Sidebar;


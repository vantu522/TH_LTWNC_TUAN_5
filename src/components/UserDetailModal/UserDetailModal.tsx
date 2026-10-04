import { memo } from "react";
import type { User } from "../../types/user";

interface UserDetailModalProps {
  user: User | null;
  onClose: () => void;
}

const UserDetailModal = memo(({ user, onClose }: UserDetailModalProps) => {
  if (!user) return null;

  const fullName = `${user.name.title} ${user.name.first} ${user.name.last}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <span className="modal-title">Chi tiết người dùng</span>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* User hero */}
        <div className="modal-user-hero">
          <img src={user.picture.large} alt={fullName} className="modal-user-avatar" loading="lazy" />
          <div>
            <div className="modal-user-name">{fullName}</div>
            <div className="modal-user-meta">
              <span className={`badge ${user.gender === "male" ? "badge-male" : "badge-female"}`}>
                {user.gender === "male" ? "Nam" : "Nữ"}
              </span>
              <span className="badge badge-nat">{user.nat}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="detail-section">
            <div className="detail-section-title">Thông tin cá nhân</div>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Email</label>
                <span>{user.email}</span>
              </div>
              <div className="detail-item">
                <label>Điện thoại</label>
                <span>{user.phone}</span>
              </div>
              <div className="detail-item">
                <label>Di động</label>
                <span>{user.cell}</span>
              </div>
              <div className="detail-item">
                <label>Tuổi</label>
                <span>{user.dob.age} tuổi</span>
              </div>
              <div className="detail-item">
                <label>Ngày sinh</label>
                <span>{new Date(user.dob.date).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="detail-item">
                <label>ID ({user.id.name})</label>
                <span>{user.id.value || "Không có"}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-section-title">Địa chỉ</div>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Đường</label>
                <span>{user.location.street.number} {user.location.street.name}</span>
              </div>
              <div className="detail-item">
                <label>Thành phố</label>
                <span>{user.location.city}</span>
              </div>
              <div className="detail-item">
                <label>Bang / Tỉnh</label>
                <span>{user.location.state}</span>
              </div>
              <div className="detail-item">
                <label>Quốc gia</label>
                <span>{user.location.country}</span>
              </div>
              <div className="detail-item">
                <label>Mã bưu điện</label>
                <span>{user.location.postcode}</span>
              </div>
              <div className="detail-item">
                <label>Múi giờ</label>
                <span>{user.location.timezone.offset} — {user.location.timezone.description}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-section-title">Tài khoản</div>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Username</label>
                <span>@{user.login.username}</span>
              </div>
              <div className="detail-item">
                <label>Ngày đăng ký</label>
                <span>{new Date(user.registered.date).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="detail-item">
                <label>Thành viên được</label>
                <span>{user.registered.age} năm</span>
              </div>
              <div className="detail-item" style={{ gridColumn: "1 / -1" }}>
                <label>UUID</label>
                <span className="mono">{user.login.uuid}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default UserDetailModal;


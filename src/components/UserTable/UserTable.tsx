import { memo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { User } from "../../types/user";

interface UserTableProps {
  users: User[];
  selectedUsers: Set<string>;
  onSelectUser: (uuid: string) => void;
  onSelectAll: () => void;
  onViewUser: (user: User) => void;
  onDeleteUser: (uuid: string) => void;
  sortField: string;
  sortOrder: "asc" | "desc";
  onSortChange: (field: string) => void;
}

const UserTable = memo(({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onViewUser,
  onDeleteUser,
  sortField,
  sortOrder,
  onSortChange,
}: UserTableProps) => {
  const allSelected = users.length > 0 && users.every((u) => selectedUsers.has(u.login.uuid));
  
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // estimated row height
    overscan: 5,
  });

  const SortIndicator = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return (
      <span className="sort-indicator">{sortOrder === "asc" ? "▲" : "▼"}</span>
    );
  };

  if (users.length === 0) {
    return (
      <div className="table-empty">
        <h3>Không tìm thấy người dùng</h3>
        <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper" ref={parentRef} style={{ maxHeight: '600px', overflowY: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
                title="Chọn tất cả trang này"
              />
            </th>
            <th
              className="sortable"
              onClick={() => onSortChange("name")}
            >
              Người dùng <SortIndicator field="name" />
            </th>
            <th
              className="sortable"
              onClick={() => onSortChange("gender")}
            >
              Giới tính <SortIndicator field="gender" />
            </th>
            <th>Email</th>
            <th
              className="sortable"
              onClick={() => onSortChange("location")}
            >
              Địa điểm <SortIndicator field="location" />
            </th>
            <th
              className="sortable"
              onClick={() => onSortChange("dob")}
            >
              Tuổi <SortIndicator field="dob" />
            </th>
            <th
              className="sortable"
              onClick={() => onSortChange("nat")}
            >
              Quốc tịch <SortIndicator field="nat" />
            </th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody style={{ position: 'relative' }}>
          {virtualizer.getVirtualItems().length > 0 && virtualizer.getVirtualItems()[0].start > 0 && (
            <tr>
              <td colSpan={7} style={{ height: `${virtualizer.getVirtualItems()[0].start}px`, padding: 0, border: 'none' }} />
            </tr>
          )}
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const user = users[virtualRow.index];
            const fullName = `${user.name.title} ${user.name.first} ${user.name.last}`;
            const isSelected = selectedUsers.has(user.login.uuid);
            return (
              <tr 
                key={user.login.uuid} 
                className={isSelected ? "selected" : ""}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectUser(user.login.uuid)}
                  />
                </td>
                <td>
                  <div className="user-cell">
                    <img
                      src={user.picture.thumbnail}
                      alt={fullName}
                      className="user-thumb"
                      loading={virtualRow.index < 5 ? "eager" : "lazy"}
                    />
                    <div>
                      <div className="user-full-name">{fullName}</div>
                      <div className="user-username">@{user.login.username}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${user.gender === "male" ? "badge-male" : "badge-female"}`}>
                    {user.gender === "male" ? "Nam" : "Nữ"}
                  </span>
                </td>
                <td>
                  <span className="cell-email" title={user.email}>{user.email}</span>
                </td>
                <td>
                  <span className="cell-location" title={`${user.location.city}, ${user.location.country}`}>
                    {user.location.city}, {user.location.country}
                  </span>
                </td>
                <td>
                  <span className="cell-age">{user.dob.age}</span>
                </td>
                <td>
                  <span className="badge badge-nat">{user.nat}</span>
                </td>
                <td>
                  <div className="row-actions">
                    <button
                      className="action-btn view"
                      onClick={() => onViewUser(user)}
                    >
                      Xem
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => onDeleteUser(user.login.uuid)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {virtualizer.getVirtualItems().length > 0 && (
            <tr>
              <td 
                colSpan={7} 
                style={{ 
                  height: `${virtualizer.getTotalSize() - virtualizer.getVirtualItems()[virtualizer.getVirtualItems().length - 1].end}px`, 
                  padding: 0, 
                  border: 'none' 
                }} 
              />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

export default UserTable;

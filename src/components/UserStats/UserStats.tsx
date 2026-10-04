import type { User } from "../../types/user";

interface UserStatsProps {
  users: User[];
}

const UserStats = ({ users }: UserStatsProps) => {
  const total = users.length;
  const male = users.filter((u) => u.gender === "male").length;
  const female = users.filter((u) => u.gender === "female").length;
  const avgAge = total
    ? Math.round(users.reduce((s, u) => s + u.dob.age, 0) / total)
    : 0;

  const countryCounts = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.location.country] = (acc[u.location.country] || 0) + 1;
    return acc;
  }, {});
  const totalCountries = Object.keys(countryCounts).length;

  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-label">Tổng người dùng</div>
        <div className="stat-value">{total.toLocaleString()}</div>
        <div className="stat-sub">Toàn bộ dữ liệu</div>
        <span className="stat-badge warning">Chưa tối ưu</span>
      </div>

      <div className="stat-card">
        <div className="stat-label">Nam</div>
        <div className="stat-value">{male.toLocaleString()}</div>
        <div className="stat-sub">
          {total ? Math.round((male / total) * 100) : 0}% tổng số
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Nữ</div>
        <div className="stat-value">{female.toLocaleString()}</div>
        <div className="stat-sub">
          {total ? Math.round((female / total) * 100) : 0}% tổng số
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Tuổi trung bình</div>
        <div className="stat-value">{avgAge}</div>
        <div className="stat-sub">Tính trên {total.toLocaleString()} người</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Quốc gia</div>
        <div className="stat-value">{totalCountries}</div>
        <div className="stat-sub">Quốc gia khác nhau</div>
        <span className="stat-badge up">Đa dạng</span>
      </div>
    </div>
  );
};

export default UserStats;

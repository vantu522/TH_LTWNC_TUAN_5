import { memo, useMemo } from "react";
import type { User } from "../../types/user";

interface UserStatsProps {
  users: User[];
}

const UserStats = memo(({ users }: UserStatsProps) => {
  // Tính toán một lần duy nhất, không lặp lại mỗi render
  const stats = useMemo(() => {
    let male = 0;
    let totalAge = 0;
    const countries = new Set<string>();

    for (const u of users) {
      if (u.gender === "male") male++;
      totalAge += u.dob.age;
      countries.add(u.location.country);
    }

    const total = users.length;
    const female = total - male;
    const avgAge = total ? Math.round(totalAge / total) : 0;
    const totalCountries = countries.size;
    const malePct = total ? Math.round((male / total) * 100) : 0;
    const femalePct = total ? Math.round((female / total) * 100) : 0;

    return { total, male, female, avgAge, totalCountries, malePct, femalePct };
  }, [users]);

  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-label">Tổng người dùng</div>
        <div className="stat-value">{stats.total.toLocaleString()}</div>
        <div className="stat-sub">Trang hiện tại</div>
        <span className="stat-badge up">Đã tối ưu</span>
      </div>

      <div className="stat-card">
        <div className="stat-label">Nam</div>
        <div className="stat-value">{stats.male.toLocaleString()}</div>
        <div className="stat-sub">{stats.malePct}% tổng số</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Nữ</div>
        <div className="stat-value">{stats.female.toLocaleString()}</div>
        <div className="stat-sub">{stats.femalePct}% tổng số</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Tuổi trung bình</div>
        <div className="stat-value">{stats.avgAge}</div>
        <div className="stat-sub">Tính trên {stats.total.toLocaleString()} người</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Quốc gia</div>
        <div className="stat-value">{stats.totalCountries}</div>
        <div className="stat-sub">Quốc gia khác nhau</div>
        <span className="stat-badge up">Đa dạng</span>
      </div>
    </div>
  );
});

export default UserStats;


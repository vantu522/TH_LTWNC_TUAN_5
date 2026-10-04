import { useState, useEffect, useRef } from "react";
import type { User } from "../types/user";
import { fetchUsers } from "../services/userService";

export interface PerfMetrics {
  filterMs: number;
  renderCount: number;
  lastSearchMs: number;
}

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  genderFilter: string;
  setGenderFilter: (gender: string) => void;
  sortField: string;
  sortOrder: "asc" | "desc";
  handleSortChange: (field: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  selectedUsers: Set<string>;
  toggleSelectUser: (uuid: string) => void;
  selectAllPage: () => void;
  clearSelection: () => void;
  deleteSelected: () => void;
  deleteSingle: (uuid: string) => void;
  totalFiltered: number;
  paginatedUsers: User[];
  perf: PerfMetrics;
}

const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTermRaw] = useState("");
  const [genderFilter, setGenderFilterRaw] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  // Đo hiệu năng
  const renderCount = useRef(0);
  const [perf, setPerf] = useState<PerfMetrics>({ filterMs: 0, renderCount: 0, lastSearchMs: 0 });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchUsers(5000);
        setUsers(data.results);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getFilteredSortedUsers = (): User[] => {
    const t0 = performance.now();

    let result = users;

    if (genderFilter !== "all") {
      result = result.filter((u) => u.gender === genderFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.first.toLowerCase().includes(term) ||
          u.name.last.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.location.country.toLowerCase().includes(term) ||
          u.login.username.toLowerCase().includes(term)
      );
    }

    result = [...result].sort((a, b) => {
      let valA = "", valB = "";
      switch (sortField) {
        case "name": valA = `${a.name.first} ${a.name.last}`; valB = `${b.name.first} ${b.name.last}`; break;
        case "gender": valA = a.gender; valB = b.gender; break;
        case "location": valA = a.location.country; valB = b.location.country; break;
        case "dob": valA = String(a.dob.age); valB = String(b.dob.age); break;
        case "nat": valA = a.nat; valB = b.nat; break;
        default: return 0;
      }
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    const t1 = performance.now();
    // Cập nhật metrics (dùng setTimeout để không gây re-render vòng lặp)
    const elapsed = parseFloat((t1 - t0).toFixed(2));
    renderCount.current += 1;
    setTimeout(() => {
      setPerf({
        filterMs: elapsed,
        renderCount: renderCount.current,
        lastSearchMs: searchTerm.trim() ? elapsed : 0,
      });
    }, 0);

    return result;
  };

  const filtered = getFilteredSortedUsers();
  const totalFiltered = filtered.length;
  const paginatedUsers = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const setSearchTerm = (term: string) => {
    setSearchTermRaw(term);
    setCurrentPage(1);
  };

  const setGenderFilter = (gender: string) => {
    setGenderFilterRaw(gender);
    setCurrentPage(1);
  };

  const handleSortChange = (field: string) => {
    if (field === sortField) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortOrder("asc"); }
    setCurrentPage(1);
  };

  const toggleSelectUser = (uuid: string) => {
    const next = new Set(selectedUsers);
    next.has(uuid) ? next.delete(uuid) : next.add(uuid);
    setSelectedUsers(next);
  };

  const selectAllPage = () => {
    const next = new Set(selectedUsers);
    const allSel = paginatedUsers.every((u) => next.has(u.login.uuid));
    if (allSel) paginatedUsers.forEach((u) => next.delete(u.login.uuid));
    else paginatedUsers.forEach((u) => next.add(u.login.uuid));
    setSelectedUsers(next);
  };

  const clearSelection = () => setSelectedUsers(new Set());

  const deleteSelected = () => {
    setUsers((prev) => prev.filter((u) => !selectedUsers.has(u.login.uuid)));
    setSelectedUsers(new Set());
    setCurrentPage(1);
  };

  const deleteSingle = (uuid: string) => {
    setUsers((prev) => prev.filter((u) => u.login.uuid !== uuid));
    setSelectedUsers((prev) => { const n = new Set(prev); n.delete(uuid); return n; });
  };

  const handleSetPageSize = (size: number) => { setPageSize(size); setCurrentPage(1); };

  return {
    users, loading, error,
    searchTerm, setSearchTerm,
    genderFilter, setGenderFilter,
    sortField, sortOrder, handleSortChange,
    currentPage, setCurrentPage,
    pageSize, setPageSize: handleSetPageSize,
    selectedUsers, toggleSelectUser, selectAllPage,
    clearSelection, deleteSelected, deleteSingle,
    totalFiltered, paginatedUsers,
    perf,
  };
};

export default useUsers;

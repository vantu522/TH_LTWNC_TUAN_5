import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import type { User } from "../types/user";
import { fetchUsers } from "../services/userService";
import { useDebounce } from "./useDebounce";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTermRaw] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
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
        const data = await fetchUsers(currentPage, pageSize);
        setUsers(data.results);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentPage, pageSize]);

  const getFilteredSortedUsers = useCallback(() => {
    const t0 = performance.now();

    let result = users;

    if (genderFilter !== "all") {
      result = result.filter((u) => u.gender === genderFilter);
    }

    if (debouncedSearchTerm.trim()) {
      const term = debouncedSearchTerm.toLowerCase();
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
        lastSearchMs: debouncedSearchTerm.trim() ? elapsed : 0,
      });
    }, 0);

    return result;
  }, [users, genderFilter, debouncedSearchTerm, sortField, sortOrder]);

  const filtered = useMemo(() => getFilteredSortedUsers(), [getFilteredSortedUsers]);
  // Khi dùng API phân trang, tổng số bản ghi giả lập là 5000 (RandomUser không hỗ trợ search server-side)
  const totalFiltered = 5000;
  // Không cần cắt mảng nữa vì API đã trả về đúng 1 trang
  const paginatedUsers = filtered;

  const setSearchTerm = useCallback((term: string) => {
    setSearchTermRaw(term);
    setCurrentPage(1);
  }, []);

  const setGenderFilter = useCallback((gender: string) => {
    setGenderFilterRaw(gender);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((field: string) => {
    setSortOrder((o) => {
      if (field === sortField) return o === "asc" ? "desc" : "asc";
      return "asc";
    });
    if (field !== sortField) {
      setSortField(field);
    }
    setCurrentPage(1);
  }, [sortField]);

  const toggleSelectUser = useCallback((uuid: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      next.has(uuid) ? next.delete(uuid) : next.add(uuid);
      return next;
    });
  }, []);

  const selectAllPage = useCallback(() => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      const allSel = paginatedUsers.every((u) => next.has(u.login.uuid));
      if (allSel) paginatedUsers.forEach((u) => next.delete(u.login.uuid));
      else paginatedUsers.forEach((u) => next.add(u.login.uuid));
      return next;
    });
  }, [paginatedUsers]);

  const clearSelection = useCallback(() => setSelectedUsers(new Set()), []);

  const deleteSelected = useCallback(() => {
    setUsers((prev) => prev.filter((u) => !selectedUsers.has(u.login.uuid)));
    setSelectedUsers(new Set());
    setCurrentPage(1);
  }, [selectedUsers]);

  const deleteSingle = useCallback((uuid: string) => {
    setUsers((prev) => prev.filter((u) => u.login.uuid !== uuid));
    setSelectedUsers((prev) => { const n = new Set(prev); n.delete(uuid); return n; });
  }, []);

  const handleSetPageSize = useCallback((size: number) => { setPageSize(size); setCurrentPage(1); }, []);

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

import type { ApiResponse } from "../types/user";

const BASE_URL = "https://randomuser.me/api";

export const fetchUsers = async (page: number = 1, results: number = 20): Promise<ApiResponse> => {
  const url = `${BASE_URL}/?seed=ltw_tuan_5&page=${page}&results=${results}&inc=name,login,gender,email,location,dob,nat,picture`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json() as Promise<ApiResponse>;
};

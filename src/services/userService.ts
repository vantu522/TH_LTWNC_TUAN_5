import axios from "axios";
import type { ApiResponse } from "../types/user";

const BASE_URL = "https://randomuser.me/api";

export const fetchUsers = async (count: number = 5000): Promise<ApiResponse> => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/?seed=user&results=${count}`);
  return response.data;
};

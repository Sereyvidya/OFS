// APIs related to user_routes.py in the server

import { fetchWithRefresh } from "./AuthRoutes";

export const getUser = async (API_URL) => {
  try {
    const res = await fetchWithRefresh(`${API_URL}/user/get`, API_URL, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error getting user:", error);
    return { ok: false };
  }
};

export const deleteUser = async (API_URL) => {
  try {
    const res = await fetchWithRefresh(`${API_URL}/user/delete`, API_URL, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { ok: res.ok };
  } catch (error) {
    return { ok: false };
  }
};

// APIs related to user_routes.py in the server

export const getUser = async (API_URL) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const res = await fetch(`${API_URL}/user/get`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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
    const token = sessionStorage.getItem("authToken");
    const res = await fetch(`${API_URL}/user/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return { ok: res.ok };
  } catch (error) {
    return { ok: false };
  }
};

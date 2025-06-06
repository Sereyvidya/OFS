// APIs related to auth_routes.py in the server

export const signup = async (API_URL, formData) => {
  try {
    const res = await fetch(`${API_URL}/auth/post/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error with signing up:", error);
    return { ok: false, error: "An error occurred. Please try again." };
  }
};

export const login = async (API_URL, formData) => {
  try {
    const res = await fetch(`${API_URL}/auth/post/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error with loging in:", error);
    return { ok: false, error: "An error occurred. Please try again." };
  }
};

export const fetchWithRefresh = async (url, API_URL, options = {}) => {
  console.log(url);
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // If access token is expired, try refreshing
  if (res.status === 401) {
    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      // Retry original request after successful refresh
      return await fetch(url, {
        ...options,
        credentials: "include",
      });
    } else {
      throw new Error("Session expired. Please log in again.");
    }
  }

  return res;
};

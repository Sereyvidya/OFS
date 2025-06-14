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

    let data = null;
    try {
      data = await res.json();
    } catch (err) {
      console.warn("Could not parse response JSON:", err);
    }
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

    let data = null;
    try {
      data = await res.json();
    } catch (err) {
      console.warn("Could not parse response JSON:", err);
    }
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error with loging in:", error);
    return { ok: false, error: "An error occurred. Please try again." };
  }
};

export const logout = async (API_URL) => {
  try {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    return { ok: res.ok };
  } catch (error) {
    console.error("Logout error:", error);
    return { ok: false, error: "An error occurred during logout." };
  }
};

export const refresh = async (API_URL) => {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        console.warn("Could not parse response JSON:", err);
      }
      return { ok: res.ok, data };
    }
    return { ok: res.ok };
  } catch (error) {
    console.error("Error refreshing:", error);
    return { ok: false };
  }
};

export const fetchWithRefresh = async (url, API_URL, options = {}) => {
  const tryFetch = async () => {
    return await fetch(url, {
      ...options,
      credentials: "include",
    });
  };

  let res = await tryFetch();

  if (res.status !== 401) return res;

  // Attempt refresh
  const { ok } = await refresh(API_URL);

  if (ok) {
    // Retry original request after successful refresh
    res = await tryFetch();
    return res;
  }

  // Handle refresh failure
  console.warn("Refresh failed. User is likely logged out.");

  // Return a synthetic response that won't break res.json()
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
};

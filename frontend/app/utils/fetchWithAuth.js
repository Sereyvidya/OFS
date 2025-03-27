export async function fetchWithAuth(url, options = {}) {
  try {
    let res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (res.status === 401) {
      console.warn("Session expired. Attempting to refresh...");

      // Try refreshing the session
      const refreshRes = await fetch("http://127.0.0.1:5000/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        throw new Error("Session refresh failed. Please log in again.");
      }

      // Retry original request after successful refresh
      res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

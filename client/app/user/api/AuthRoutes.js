// APIs related to the auth_routes.py in the server

export const signupUser = async (API_URL, formData) => {
  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
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

export const loginUser = async (API_URL, formData) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error with loging in:", error);
    return { ok: false, error: "An error occurred. Please try again." };
  }
};

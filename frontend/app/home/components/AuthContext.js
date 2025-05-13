import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    // Check localStorage for the token on initial load
    const savedToken = localStorage.getItem("authToken");

    if (savedToken) {
      setAuthToken(savedToken);
    }
  }, []);

  const login = (token) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token); // Keep token in localStorage on login
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken"); // Remove token from localStorage on logout
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
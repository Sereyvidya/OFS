"use client";

import React, { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok) {
        alert("Login successful!");
        localStorage.setItem("authToken", data.token);

        // Check if the user is an admin based on their email
        const isAdmin = formData.email.endsWith("@OFS.com");
        localStorage.setItem("isAdmin", isAdmin); // Store admin status

        if (isAdmin) {
          window.location.href = "/admin"; // Redirect to admin page
        } else {
          onClose();
          onLoginSuccess(data.token);
        }
      } else {
        setErrorMessage(data.error || "Password doesn't match. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-100 h-auto m-auto bg-white p-4 rounded-lg">
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex justify-center">
          <h1 className="font-display text-4xl font-bold">Admin Log in</h1>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-center mt-2">{errorMessage}</p>
          )}

        {/* Email */}
        <div className="relative w-full mt-6">
          <input 
            type="text" 
            placeholder="Email" 
            className="w-full border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"/> 
        </div>

        {/* Password */}
        <div className="relative w-full mt-6">
          <input 
            type={showPassword ? "text" : "password"}
            placeholder="Password" 
            className="w-full border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Log in button */}
        <button 
          type="submit" 
          className="font-semibold px-4 py-2 mt-6 border border-blue-300 rounded-full bg-blue-600 text-white hover:bg-blue-400 hover:scale-101 shadow transition-colors cursor-pointer whitespace-nowrap">
          Log in
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

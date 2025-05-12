"use client";

import React, { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ onClose, onSignupClick, onLoginSuccess, apiUrl }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLogging, setIsLogging] = useState(false); // Prevent multiple logins

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (isLogging) return;
      setIsLogging(true);
    
    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok) {
        alert("Login successful!");
        localStorage.setItem("authToken", data.token);
        onClose();
        onLoginSuccess(data.token);
      } else {
        setErrorMessage(data.error || "Password doesn't match. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred while logging in. Please try again.");
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="flex flex-col w-100 h-auto m-auto bg-[#f1f0e9] pb-4 rounded-lg">
      {/* Login and Close button */}
      <div className="relative bg-[#41644a] border-b border-[#90b89b] text-white flex justify-between items-center h-20 px-4 py-4 rounded-t-lg">
        <h1 className="absolute left-1/2 top-4 transform -translate-x-1/2 font-display text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">Log in</h1>
        <button
          className="absolute right-4 top-4 bg-[#f1f0e9] border border-[#90b89b] text-[#41644a] px-2 rounded hover:bg-[#73977b] hover:scale-103 shadow transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col px-4 mt-2">

        {errorMessage && (
          <p className="text-red-500 text-center mt-2">{errorMessage}</p>
          )}

        {/* Email */}
        <div className="mt-4 relative w-full">
          <input 
            type="text" 
            placeholder="Email" 
            className="w-full border border-gray-300 text-[#0d4715] placeholder-[#73977b] hover:bg-[#90b89b] rounded-md p-2 shadow transition-colors whitespace-nowrap focus:outline-[#0d4715]"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#73977b]"/> 
        </div>

        {/* Password */}
        <div className="relative w-full mt-6">
          <input 
            type={showPassword ? "text" : "password"}
            placeholder="Password" 
            className="w-full border border-gray-300 text-[#0d4715] placeholder-[#73977b] hover:bg-[#90b89b] rounded-md p-2 shadow transition-colors whitespace-nowrap focus:outline-[#0d4715]"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#73977b]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Log in button */}
          <button
            type="submit" 
            className={`mt-6 font-semibold px-4 py-2 bg-[#e9762b] border-2 border-orange-300 text-[#f1f0e9] hover:bg-orange-400 rounded-full hover:scale-102 shadow transition-colors cursor-pointer whitespace-nowrap ${
              isLogging ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLogging}
          >
            {isLogging ? "Logging in..." : "Log in"}
          </button>

        {/* Sign up prompt */}
        <div className="flex justify-center mt-2">
          <p className="mr-1 text-[#0d4715]">Don't have an account?</p>
          <p
            className={`font-semibold text-[#73977b] hover:underline ${
              isLogging ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
            onClick={() => {
              if (!isLogging) {
                onSignupClick();
              }
            }}
            >
            Sign up
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
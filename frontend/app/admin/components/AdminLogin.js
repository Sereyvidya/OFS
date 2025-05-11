"use client";

import React, { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from "react-toastify";

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
      const res = await fetch("http://127.0.0.1:5000/employee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok) {
        toast.success("Log in successful!", {
          onClose: () => {
            sessionStorage.setItem("authToken", data.token);
            onLoginSuccess(data.token);
          }
        });
      } else {
        setErrorMessage(data.error || "Password doesn't match. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-100 h-auto m-auto bg-[#f1f0e9] rounded-lg">
      {/* Login and Close button */}
      <div className="border-2 border-[#90b89b4d] relative bg-[#41644a] text-[#f1f0e9] flex justify-between items-center h-20 px-4 py-4 rounded-t-lg">
        <h1 className="absolute left-1/2 top-4 transform -translate-x-1/2 font-display text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">Log in</h1>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col border-2 border-gray-400 rounded-b-lg px-4 pb-4">
        {errorMessage && (
          <p className="text-red-500 text-center mt-6">{errorMessage}</p>
        )}

        {/* Email */}
        <div className="relative w-full mt-6">
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
          className="mt-6 font-semibold px-4 py-2 bg-[#e9762b] border-2 border-orange-300 text-[#f1f0e9] hover:bg-orange-400 rounded-full hover:scale-102 shadow transition-colors cursor-pointer whitespace-nowrap">
          Log in
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

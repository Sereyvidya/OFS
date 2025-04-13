"use client";

import React, { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ onClose, onSignupClick, onLoginSuccess }) => {
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
        onClose();
        onLoginSuccess(data.token);
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
      {/* Close button */}
      <div>
        <button
            className="bg-gray-300 px-2 rounded hover:bg-gray-400 hover:scale-103 shadow transition-colors"
            onClick={onClose}
          >
            &times;
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex justify-center">
          <h1 className="font-display text-4xl font-bold">Log in</h1>
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

        {/* Forget password */}
        {/* <div className="mt-2 text-right">
          <a href="#" className="text-black">Forget Password?</a>
        </div> */}

        {/* Log in button */}
        <button 
          type="submit" 
          className="font-semibold px-4 py-2 mt-6 border border-blue-300 rounded-full bg-blue-600 text-white hover:bg-blue-400 hover:scale-101 shadow transition-colors cursor-pointer whitespace-nowrap">
          Log in
        </button>

        {/* Sign up prompt */}
        <div className="flex justify-center mt-2">
          <p className="mr-1">Don't have an account?</p>
          <p 
            className="font-semibold text-blue-400 hover:underline cursor-pointer"
            onClick={onSignupClick}>
            Sign up
          </p>
        </div>

      </form>
    </div>
  );
};

export default Login;

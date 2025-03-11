"use client";

import React, { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ onClose, onSignupClick }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Login response:", data);

    //   if (res.ok) {
    //     router.push("/homepage");
    //   } else {
    //     setError(data.error || "Password doesn't match. Please try again.");
    //   }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-100 h-auto m-auto bg-white p-4 rounded-lg">
      {/* Close button */}
      <div>
        <button 
          className="text-lg font-bold text-gray-600 hover:text-black"
          onClick={onClose}>
          x
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex justify-center">
          <h1 className="font-display text-4xl font-bold">Log in</h1>
        </div>

        {/* Email */}
        <div className="flex justify-between mt-6 border border-black rounded-md p-2">
          <input 
            type="text" 
            placeholder="Email" 
            className="w-full mx-2 focus:outline-none focus:border-none"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <FaEnvelope className="my-auto mx-2"/> 
        </div>

        {/* Password */}
        <div className="flex justify-between mt-6 border border-black rounded-md p-2">
          <input 
            type={showPassword ? "text" : "password"}
            placeholder="Password" 
            className="w-full mx-2 focus:outline-none focus:border-none"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <span
              className="my-auto mx-2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Forget password */}
        <div className="mt-2 text-right">
          <a href="#" className="text-black">Forget Password?</a>
        </div>

        {/* Log in button */}
        <button type="submit" className="text-center text-white mt-2 bg-blue-500 rounded-md p-2">
          Log in
        </button>

        {/* Sign up prompt */}
        <div className="flex justify-center mt-2">
          <p className="mr-1">Don't have an account?</p>
          <p 
            className="font-semibold text-blue-400 hover:underline"
            onClick={onSignupClick}>
            Sign up
          </p>
        </div>

      </form>
    </div>
  );
};

export default Login;

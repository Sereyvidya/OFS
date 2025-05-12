"use client";

import React, { useState } from "react";

const Signup = ({ onClose, onLoginClick, apiUrl }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      return;
    } else {
      setErrorMessage("");
    }

    console.log("Sending data:", formData);

    try {
      const res = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Response received:", data);

      if (res.ok) {
        alert("Registration successful!");
        onClose();
        onLoginClick();
      } else {
        setErrorMessage(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
      <div className="flex flex-col w-150 h-auto m-auto bg-[#f1f0e9] pb-4 rounded-lg">
        {/* Sign up and Close button */}
        <div className="relative bg-[#41644a] border-b border-[#90b89b] text-white flex justify-between items-center h-20 px-4 py-4 rounded-t-lg">
          <h1 className="absolute left-1/2 top-4 transform -translate-x-1/2 font-display text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">Sign in</h1>
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
          
          {/* Full Name */}
          <div className="flex flex-col">
            <p className="text-[#0d4715]">Full Name</p>
            <div className="flex flex-col sm:flex-row justify-between mt-2 gap-6">
              <input
                type="text"
                placeholder="First"
                className="w-full border border-gray-300 text-[#0d4715] placeholder-[#73977b] hover:bg-[#90b89b] rounded-md p-2 shadow transition-colors whitespace-nowrap focus:outline-[#0d4715]"
                value={formData.firstName}
                onChange={(e) => {
                  const formattedName = e.target.value
                    .toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase());
                  setFormData({ ...formData, firstName: formattedName });
                }}/>
              <input
                type="text"
                placeholder="Last"
                className="w-full border border-gray-300 text-[#0d4715] placeholder-[#73977b] hover:bg-[#90b89b] rounded-md p-2 shadow transition-colors whitespace-nowrap focus:outline-[#0d4715]"
                value={formData.lastName}
                onChange={(e) => {
                  const formattedName = e.target.value
                    .toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase());
                  setFormData({ ...formData, lastName: formattedName });
                }}/>
            </div>
          </div>

          {/* Email & Phone Number */}
          <div className="flex flex-col sm:flex-row justify-between mt-4 gap-6">
            <div className="flex flex-col w-full">
              <p className="text-[#0d4715]">Email</p>
              <input 
                type="email"
                placeholder="example@gmail.com"
                className="mt-2 w-full border border-gray-300 text-[#0d4715] placeholder-[#73977b] hover:bg-[#90b89b] rounded-md p-2 shadow transition-colors whitespace-nowrap focus:outline-[#0d4715]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
            </div>
            <div className="flex flex-col w-full">
              <p className="text-[#0d4715]">Phone Number</p>
              <input 
                type="tel"
                placeholder="XXXXXXXXXX"
                className="mt-2 w-full border border-gray-300 text-[#0d4715] placeholder-[#73977b] hover:bg-[#90b89b] rounded-md p-2 shadow transition-colors whitespace-nowrap focus:outline-[#0d4715]"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}/>
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col mt-4">
            <p className="text-[#0d4715]">Password</p>
            <div className="flex flex-col sm:flex-row justify-between mt-2 gap-6">
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 text-[#0d4715] placeholder-[#73977b] hover:bg-[#90b89b] rounded-md p-2 shadow transition-colors whitespace-nowrap focus:outline-[#0d4715]"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border border-gray-300 text-[#0d4715] placeholder-[#73977b] hover:bg-[#90b89b] rounded-md p-2 shadow transition-colors whitespace-nowrap focus:outline-[#0d4715]"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}/>
            </div>
            <p className="text-xs italic text-[#0d4715] mt-2">
                Password must be at least 8 characters long and contain 1 lowercase letters, 
                1 upppercase letter, 1 digit, and 1 special character (@$!%*?&).
            </p>
          </div>

          {/* Sign Up Button */}
          <button 
            type="submit" 
            className="mt-6 font-semibold px-4 py-2 bg-[#e9762b] border border-orange-300 text-[#f1f0e9] hover:bg-orange-400 rounded-full hover:scale-102 shadow transition-colors cursor-pointer whitespace-nowrap">
            Sign up
          </button>

          {/* Login Link */}
          <div className="flex justify-center mt-4">
            <p className="mr-1 text-[#0d4715]">Already have an account?</p>
            <p
              className={`font-semibold text-[#73977b] hover:underline ${
                isLogging ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              onClick={() => {
                if (!isSubmitting) {
                  onLoginClick();
                }
              }}
            >
              Log in
            </p>
          </div>
        </form>
      </div>
  );
}

export default Signup;
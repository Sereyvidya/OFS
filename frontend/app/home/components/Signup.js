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
      <div className="flex flex-col w-150 h-auto m-auto bg-white p-4 rounded-lg">
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
            <h1 className="font-display text-4xl font-bold">Sign up</h1>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-center mt-2">{errorMessage}</p>
          )}
          
          {/* Full Name */}
          <div className="flex flex-col">
            <p>Full Name</p>
            <div className="flex flex-col sm:flex-row justify-between mt-2 gap-6">
              <input
                type="text"
                placeholder="First"
                className="w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
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
                className="w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
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
              <p>Email</p>
              <input 
                type="email"
                placeholder="example@gmail.com"
                className="mt-2 w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
            </div>
            <div className="flex flex-col w-full">
              <p>Phone Number</p>
              <input 
                type="tel"
                placeholder="XXXXXXXXXX"
                className="mt-2 w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}/>
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col mt-4">
            <p>Password</p>
            <div className="flex flex-col sm:flex-row justify-between mt-2 gap-6">
              <input
                type="password"
                placeholder="Password"
                className="w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full flex justify-between border border-gray-300 rounded-md p-2 hover:bg-gray-200 shadow transition-colors whitespace-nowrap focus:outline-gray-400"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}/>
            </div>
            <p className="text-xs italic text-gray-600 mt-2">
                Password must be at least 8 characters long and contain 1 lowercase letters, 
                1 upppercase letter, 1 digit, and 1 special character (@$!%*?&).
            </p>
          </div>

          {/* Sign Up Button */}
          <button 
            type="submit" 
            className="font-semibold px-4 py-2 mt-6 border border-blue-300 rounded-full bg-blue-600 text-white hover:bg-blue-400 hover:scale-101 shadow transition-colors cursor-pointer whitespace-nowrap">
            Sign up
          </button>

          {/* Login Link */}
          <div className="flex justify-center mt-4">
            <p className="mr-1">Already have an account?</p>
            <p 
              className="font-semibold text-blue-400 hover:underline cursor-pointer"
              onClick={onLoginClick}>
              Log in
            </p>
          </div>
        </form>
      </div>
  );
}

export default Signup;
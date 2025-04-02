"use client";

import React, { useState } from "react";

const Signup = ({ onClose, onLoginClick }) => {
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
      const res = await fetch("http://127.0.0.1:5000/auth/signup", {
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
            className="text-lg font-bold text-gray-600 hover:text-black"
            onClick={onClose}>
            x
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
            <div className="flex justify-between mt-2">
              <input
                type="text"
                placeholder="First"
                className="border border-black rounded-md p-2 w-68"
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
                className="border border-black rounded-md p-2 w-68"
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
          <div className="flex justify-between mt-4">
            <div className="flex flex-col">
              <p>Email</p>
              <input 
                type="email"
                placeholder="example@gmail.com"
                className="border border-black rounded-md p-2 w-68 mt-2"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
            </div>
            <div className="flex flex-col">
              <p>Phone Number</p>
              <input 
                type="tel"
                placeholder="XXXXXXXXXX"
                className="border border-black rounded-md p-2 w-68 mt-2"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}/>
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col mt-4">
            <p>Password</p>
            <div className="flex justify-between mt-2">
              <input
                type="password"
                placeholder="Password"
                className="border border-black rounded-md p-2 w-68"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
              <input
                type="password"
                placeholder="Confirm Password"
                className="border border-black rounded-md p-2 w-68"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}/>
            </div>
            <p className="text-xs italic text-gray-600 mt-2">
                Password must be at least 8 characters long and contain 1 lowercase letters, 
                1 upppercase letter, 1 digit, and 1 special character (@$!%*?&).
            </p>
          </div>

          {/* Sign Up Button */}
          <button type="submit" className="text-center text-white mt-2 bg-blue-500 rounded-md p-2 mt-6">
            Sign up
          </button>

          {/* Login Link */}
          <div className="flex justify-center mt-4">
            <p className="mr-1">Already have an account?</p>
            <p 
              className="font-semibold text-blue-400 hover:underline"
              onClick={onLoginClick}>
              Log in
            </p>
          </div>
        </form>
      </div>
  );
}

export default Signup;
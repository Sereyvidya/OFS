"use client";

import React, { useState } from "react";
import { FaUser, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      const res = await fetch("http://127.0.0.1:5000/register", {
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
      } else {
        setErrorMessage(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center"
      style={{ backgroundImage: 'url(/bg.jpg)' }}
    >
      <div className="flex flex-col w-100 h-auto m-auto backdrop-blur-sm bg-white/10 p-8 rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-center">
            <h1 className="font-display text-4xl font-bold text-white">Register</h1>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-center mt-2">{errorMessage}</p>
          )}

          {/* Full Name */}
          <div className="flex justify-between mt-6 border border-white rounded-full p-2">
            <input
              type="text"
              placeholder="Full Name"
              className={`w-full mx-2 bg-transparent placeholder-gray-400 focus:outline-none ${
                formData.fullName ? "text-white" : "text-gray-400"
              }`}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <FaUser className="my-auto mx-2 text-gray-400" />
          </div>

          {/* Email */}
          <div className="flex justify-between mt-4 border border-white rounded-full p-2">
            <input
              type="email"
              placeholder="Email"
              className={`w-full mx-2 bg-transparent placeholder-gray-400 focus:outline-none ${
                formData.email ? "text-white" : "text-gray-400"
              }`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <FaEnvelope className="my-auto mx-2 text-gray-400" />
          </div>

          {/* Username */}
          <div className="flex justify-between mt-4 border border-white rounded-full p-2">
            <input
              type="text"
              placeholder="Username"
              className={`w-full mx-2 bg-transparent placeholder-gray-400 focus:outline-none ${
                formData.username ? "text-white" : "text-gray-400"
              }`}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <FaUser className="my-auto mx-2 text-gray-400" />
          </div>

          {/* Password */}
          <div className="flex justify-between mt-4 border border-white rounded-full p-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full mx-2 bg-transparent placeholder-gray-400 focus:outline-none ${
                formData.password ? "text-white" : "text-gray-400"
              }`}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <span
              className="my-auto mx-2 cursor-pointer text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="flex justify-between mt-4 border border-white rounded-full p-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={`w-full mx-2 bg-transparent placeholder-gray-400 focus:outline-none ${
                formData.confirmPassword ? "text-white" : "text-gray-400"
              }`}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
            <span
              className="my-auto mx-2 cursor-pointer text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="mt-6 text-center bg-white text-black font-bold border border-white rounded-full p-2 cursor-pointer hover:bg-gray-300"
          >
            Register
          </button>

          {/* Login Link */}
          <div className="flex justify-center mt-4">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-blue-400 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

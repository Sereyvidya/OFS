"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "../context/UserContext";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../api/AuthRoutes";

/**
 * Renders a login form with email, password, and "Log in" button.
 */
const Login = () => {
  const { API_URL, setShowLogin, setShowSignup, setIsLoggedIn } =
    useUserContext();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // For disabling log in button while waiting for a response
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set a cooldown on the log in button when response is successful
  const [cooldown, setCooldown] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || cooldown) return;

    setIsSubmitting(true);

    const { ok, data, error } = await login(API_URL, formData);

    if (ok) {
      toast.success("Log in successful!", {
        onClose: () => {
          sessionStorage.setItem("authToken", data.token);
          setIsLoggedIn(true);
          setShowLogin(false);
        },
      });
      setCooldown(true);
      setTimeout(() => setCooldown(false), 5000);
    } else {
      setErrorMessage(
        data?.error || error || "Log in failed. Please try again.",
      );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="m-auto flex h-auto w-100 flex-col rounded-lg bg-[#f1f0e9]">
      {/* Login and Close button */}
      <div className="relative flex h-20 items-center justify-between rounded-t-lg border-2 border-[#90b89b4d] bg-[#41644a] px-4 py-4 text-[#f1f0e9]">
        <h1 className="font-display absolute top-4 left-1/2 -translate-x-1/2 transform text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">
          Log in
        </h1>
        <button
          className="absolute top-4 right-4 rounded border border-[#90b89b] bg-[#f1f0e9] px-2 text-[#41644a] shadow transition-colors hover:scale-103 hover:bg-[#73977b] focus:ring-2 focus:ring-[#73977b] focus:outline-none"
          onClick={() => setShowLogin(false)}
        >
          &times;
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleLoginSubmit}
        className="flex flex-col rounded-b-lg border-2 border-gray-400 px-4 py-4"
      >
        {errorMessage && (
          <p className="mt-2 text-center text-red-500">{errorMessage}</p>
        )}

        {/* Email */}
        <div className="relative mt-4 w-full">
          <input
            type="text"
            placeholder="Email"
            className="w-full rounded-md border border-gray-300 p-2 whitespace-nowrap text-[#0d4715] placeholder-[#73977b] shadow transition-colors hover:bg-[#90b89b] focus:outline-[#41644a]"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setErrorMessage("");
            }}
          />
          <FaEnvelope className="absolute top-1/2 right-3 -translate-y-1/2 transform text-[#73977b]" />
        </div>

        {/* Password */}
        <div className="relative mt-6 w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full rounded-md border border-gray-300 p-2 whitespace-nowrap text-[#0d4715] placeholder-[#73977b] shadow transition-colors hover:bg-[#90b89b] focus:outline-[#41644a]"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setErrorMessage("");
            }}
          />
          <span
            className="absolute top-1/2 right-3 -translate-y-1/2 transform text-[#73977b]"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Log in button */}
        <button
          type="submit"
          className={`mt-6 cursor-pointer rounded-full border-2 border-orange-300 bg-[#e9762b] px-4 py-2 font-semibold whitespace-nowrap text-[#f1f0e9] shadow transition-colors hover:scale-102 hover:bg-orange-400 focus:ring-2 focus:ring-orange-500 focus:outline-none ${
            isSubmitting ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isSubmitting || cooldown}
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>

        {/* Sign up prompt */}
        <div className="mt-2 flex justify-center">
          <p className="mr-1 text-[#0d4715]">Don't have an account?</p>
          <p
            className={`font-semibold text-[#73977b] hover:underline ${
              isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
            onClick={() => {
              if (!isSubmitting) {
                setShowLogin(false);
                setShowSignup(true);
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

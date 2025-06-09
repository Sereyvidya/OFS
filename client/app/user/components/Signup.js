"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "../context/UserContext";
import { signup } from "../../api/AuthRoutes";

/**
 * Renders a signup form with first name, last name, email,
 * phone number, password, and "Sign up" button.
 */
const Signup = () => {
  const { API_URL, setShowSignup, setShowLogin } = useUserContext();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  // For disabling the sign up button while waiting for a response
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set a cooldown on the sign up button when response is successful
  const [cooldown, setCooldown] = useState(false);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || cooldown) return;

    setIsSubmitting(true);

    const { ok, data, error } = await signup(API_URL, formData);

    if (ok) {
      toast.success("Sign up successful!", {
        onClose: () => {
          setShowSignup(false);
          setShowLogin(true);
        },
      });
      setCooldown(true);
      setTimeout(() => setCooldown(false), 5000);
    } else {
      setErrorMessage(
        data?.error || error || "Sign up failed. Please try again.",
      );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="m-auto flex h-auto w-150 flex-col rounded-lg bg-[#f1f0e9]">
      {/* Header */}
      <div className="relative flex h-20 items-center justify-between rounded-t-lg border-2 border-[#90b89b4d] bg-[#41644a] px-4 py-4 text-[#f1f0e9]">
        <h1 className="font-display absolute top-4 left-1/2 -translate-x-1/2 transform text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">
          Sign up
        </h1>
        <button
          className="absolute top-4 right-4 rounded border border-[#90b89b] bg-[#f1f0e9] px-2 text-[#41644a] shadow transition-colors hover:scale-103 hover:bg-[#73977b] focus:ring-2 focus:ring-[#73977b] focus:outline-none"
          onClick={() => setShowSignup(false)}
        >
          &times;
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSignupSubmit}
        className="flex flex-col rounded-b-lg border-2 border-gray-400 px-4 py-4"
      >
        {errorMessage && (
          <p className="text-center text-red-500">{errorMessage}</p>
        )}

        {/* Full Name */}
        <div className="flex flex-col">
          <p className="text-[#0d4715]">Full Name</p>
          <div className="mt-2 flex flex-col justify-between gap-6 sm:flex-row">
            <input
              type="text"
              placeholder="First"
              className="w-full rounded-md border border-gray-300 p-2 whitespace-nowrap text-[#0d4715] placeholder-[#73977b] shadow transition-colors hover:bg-[#90b89b] focus:outline-[#41644a]"
              value={formData.firstName}
              onChange={(e) => {
                const formattedName = e.target.value
                  .toLowerCase()
                  .replace(/^\w/, (c) => c.toUpperCase());
                setFormData({ ...formData, firstName: formattedName });
                setErrorMessage("");
              }}
            />
            <input
              type="text"
              placeholder="Last"
              className="w-full rounded-md border border-gray-300 p-2 whitespace-nowrap text-[#0d4715] placeholder-[#73977b] shadow transition-colors hover:bg-[#90b89b] focus:outline-[#41644a]"
              value={formData.lastName}
              onChange={(e) => {
                const formattedName = e.target.value
                  .toLowerCase()
                  .replace(/^\w/, (c) => c.toUpperCase());
                setFormData({ ...formData, lastName: formattedName });
                setErrorMessage("");
              }}
            />
          </div>
        </div>

        {/* Email & Phone Number */}
        <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row">
          <div className="flex w-full flex-col">
            <p className="text-[#0d4715]">Email</p>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="mt-2 w-full rounded-md border border-gray-300 p-2 whitespace-nowrap text-[#0d4715] placeholder-[#73977b] shadow transition-colors hover:bg-[#90b89b] focus:outline-[#41644a]"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrorMessage("");
              }}
            />
          </div>
          <div className="flex w-full flex-col">
            <p className="text-[#0d4715]">Phone Number</p>
            <input
              type="tel"
              placeholder="XXXXXXXXXX"
              className="mt-2 w-full rounded-md border border-gray-300 p-2 whitespace-nowrap text-[#0d4715] placeholder-[#73977b] shadow transition-colors hover:bg-[#90b89b] focus:outline-[#41644a]"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                setErrorMessage("");
              }}
            />
          </div>
        </div>

        {/* Password and Confirm Password */}
        <div className="mt-4 flex flex-col">
          <p className="text-[#0d4715]">Password</p>
          <div className="mt-2 flex flex-col justify-between gap-6 sm:flex-row">
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-md border border-gray-300 p-2 whitespace-nowrap text-[#0d4715] placeholder-[#73977b] shadow transition-colors hover:bg-[#90b89b] focus:outline-[#41644a]"
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setErrorMessage("");
              }}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full rounded-md border border-gray-300 p-2 whitespace-nowrap text-[#0d4715] placeholder-[#73977b] shadow transition-colors hover:bg-[#90b89b] focus:outline-[#41644a]"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                setErrorMessage("");
              }}
            />
          </div>
          <p className="mt-2 text-xs text-[#0d4715] italic">
            Password must be at least 8 characters long and contain 1 lowercase
            letters, 1 upppercase letter, 1 digit, and 1 special character
            (@$!%*?&).
          </p>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className={`mt-6 cursor-pointer rounded-full border-2 border-orange-300 bg-[#e9762b] px-4 py-2 font-semibold whitespace-nowrap text-[#f1f0e9] shadow transition-colors hover:scale-102 hover:bg-orange-400 focus:ring-2 focus:ring-orange-500 focus:outline-none ${
            isSubmitting ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isSubmitting || cooldown}
        >
          {isSubmitting ? "Signing up..." : "Sign up"}
        </button>

        {/* Login Link */}
        <div className="mt-4 flex justify-center">
          <p className="mr-1 text-[#0d4715]">Already have an account?</p>
          <p
            className="cursor-pointer font-semibold text-[#73977b] hover:underline"
            onClick={() => {
              if (!isSubmitting) {
                setShowLogin(true);
                setShowSignup(false);
              }
            }}
          >
            Log in
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;

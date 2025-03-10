"use client";

import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { FaLock } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const login = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear previous errors

    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok) {
        // Successful login
        router.push("/homepage");
      } else {
        // If the login fails, show error message
        setError(data.error || "Password doesn't match. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred while logging in. Please try again.");
    }
  };
    

    return (
        <div className="min-h-screen bg-cover bg-center flex flex-col justify-center" style={{backgroundImage: 'url(/bg.jpg)'}}>
            <div className="flex flex-col w-100 h-auto m-auto backdrop-blur-sm bg-white/10 p-8 rounded-lg">
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex justify-center">
                        <h1 className="font-display text-4xl font-bold">Login</h1>
                    </div>
                    <div className="flex justify-between mt-6 border border-white rounded-l-full rounded-r-full p-2">
                        <input 
                            type="text" 
                            placeholder="username" 
                            className="w-full mx-2 focus:outline-none focus:border-none"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}>
                        </input>
                        <FaUser className="my-auto mx-2"/> 
                    </div>
                    <div className="flex justify-between mt-6 border border-white rounded-l-full rounded-r-full p-2">
                        <input 
                            type="password" 
                            placeholder="password" 
                            className="w-full mx-2 focus:outline-none focus:border-none"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}>
                        </input>
                        <FaLock className="my-auto mx-2"/>
                    </div>
                    <div className="mt-2 text-right">
                        <a href="#" className="text-white/50">Forget Password?</a>
                    </div>
                    <button type="submit" className="text-center text-black mt-2 border border-white bg-white rounded-l-full rounded-r-full p-2">Log in</button>
                    <div className="flex justify-center mt-2">
                        <p>Don't have an account? 
                        <Link href="/register" className="font-semibold text-blue-400 hover:underline"> Register </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default login;

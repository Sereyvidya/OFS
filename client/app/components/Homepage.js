import React from 'react';
import { FaUser } from 'react-icons/fa';
import { FaLock } from "react-icons/fa";

const HomePage = () => {
  return (
    <div
        className="min-h-screen bg-cover bg-center flex flex-col justify-center"
        style={{
            backgroundImage: 'url(/bg.jpg)',
        }}>
        <div>
            <h1 className="text-6xl pl-4 mt-4">OFS</h1>
        </div>
        <div className="flex flex-col w-100 h-auto m-auto backdrop-blur-sm bg-white/10 p-8 rounded-lg">
            <form action="" className="flex flex-col">
                <div className="flex justify-center">
                    <h1 className="font-display text-4xl font-bold">Login</h1>
                </div>
                <div className="flex justify-between mt-6 border border-white rounded-l-full rounded-r-full p-2">
                    <input type="text" placeholder="username" className="w-full mx-2 focus:outline-none focus:border-none"></input>
                    <FaUser className="my-auto mx-2"/> 
                </div>
                <div className="flex justify-between mt-6 border border-white rounded-l-full rounded-r-full p-2">
                    <input type="password" placeholder="password" className="w-full mx-2 focus:outline-none focus:border-none"></input>
                    <FaLock className="my-auto mx-2"/>
                </div>
                <div className="mt-2 text-right">
                    <a href="#" className="text-white/50">Forget Password?</a>
                </div>
                <div className="text-center text-black mt-2 border border-white bg-white rounded-l-full rounded-r-full p-2">
                    <button>Log in</button>
                </div>
                <div className="flex justify-center mt-2">
                    <p>Don't have an account? 
                        <a href="#" className="font-semibold"> Register</a>
                    </p>
                </div>
            </form>
        </div>
    </div>
  );
};

export default HomePage;

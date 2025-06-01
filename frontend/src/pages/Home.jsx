import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

export const Home = () => {
  const authToken = localStorage.getItem("authToken"); // ✅ Check if user is logged in

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-yellow-300 to-orange-400 p-10 text-gray-800">
        {/* ✅ Welcome Section */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
          Welcome to Your Digital Wallet 💰
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl text-center mb-6">
          Manage your funds, track transactions, and make secure payments with ease!
        </p>

        {/* ✅ Call to Action (Login / Dashboard) */}
        <div className="flex space-x-4">
          {authToken ? (
            <Link to="/dashboard">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all">
                Go to Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-all">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg shadow-lg transition-all">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>

        {/* ✅ Feature Highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">💳 Easy Payments</h2>
            <p className="text-gray-600 text-center">
              Send and receive money instantly with secure transactions.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">📊 Transaction History</h2>
            <p className="text-gray-600 text-center">
              Track all your financial activity in one place.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">🔒 Secure & Private</h2>
            <p className="text-gray-600 text-center">
              Your data is protected with advanced security features.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

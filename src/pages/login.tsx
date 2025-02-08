"use client";
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Github,
  Twitter,
  User,
  AlertCircle,
  Facebook,
} from "lucide-react";
import Placeldoler from "../assets/placeholder-assigment.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        navigate("/recipes");
      } else {
        setError("Login failed: " + (data.error || "Invalid credentials"));
        setShowModal(true);
      }
    } catch (error) {
      setError("An error occurred during login");
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-300 to-slate-100 py-8 flex flex-col relative">
      {/* Error Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all">
            <div className="flex items-center mb-4 text-red-600">
              <AlertCircle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">Error</h3>
            </div>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={() => setShowModal(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-6xl mx-auto w-full px-4">
        <div className="space-y-2 mb-12">
          <h1 className="text-4xl font-bold text-[#484848]">
            Welcome Back! 👋
          </h1>
          <h2 className="text-xl text-gray-600">Please enter your details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:block">
            <img
              src={Placeldoler}
              alt="Login illustration"
              className="w-full max-w-md mx-auto rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#129575] focus:border-transparent transition-all pl-10"
                    placeholder="Enter your email"
                    required
                  />
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-gray-400" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#129575] focus:border-transparent transition-all pl-10"
                    placeholder="Enter your password"
                    required
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-[#129575]" />
                  <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#129575] hover:text-[#129575]/80"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full py-3 bg-[#129575] hover:bg-[#129575]/90 text-white rounded-lg transition-all transform hover:scale-[1.02]"
              >
                Sign in
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center justify-center gap-2 py-2.5"
                >
                  <Mail className="w-5 h-5" />
                  Gmail
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center justify-center gap-2 py-2.5"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook
                </Button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#129575] hover:text-[#129575]/80 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

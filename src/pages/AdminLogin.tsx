import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@staytheory.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      // Backend expects OAuth2 form data (username/password)
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await axios.post(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api/v1`}/auth/login`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.data.access_token) {
        localStorage.setItem("staytheory_token", response.data.access_token);
        navigate("/admin");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      const msg = err.response?.data?.detail || "Invalid email or password";
      setError(typeof msg === 'string' ? msg : "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-border">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

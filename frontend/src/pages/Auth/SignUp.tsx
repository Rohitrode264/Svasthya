"use client";
import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, User } from "lucide-react";
import { Input } from "../../component/Input";
import { Button } from "../../component/Button";
import { Card } from "../../component/AuthCard";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../../config";

export default function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/register`, form);
      setMessage({ type: "success", text: data.message || "Verification code sent to your email." });

      // Navigate to verification page with email
      setTimeout(() => {
        navigate("/verify", { state: { email: form.email } });
      }, 1000);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error || "Something went wrong. Please try again.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-teal-50 to-white flex items-center justify-center px-4">
      <Card title="Sign-Up" subtitle="Create your account to get started">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="John Doe"
            icon={User}
            value={form.name}
            onChange={handleChange}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={form.password}
            onChange={handleChange}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending Code..." : "Sign Up"}
          </Button>

          {message && (
            <p
              className={`text-center text-sm font-medium ${message.type === "success" ? "text-teal-600" : "text-red-500"
                }`}
            >
              {message.text}
            </p>
          )}
        </form>

        <p className="text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600 hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}

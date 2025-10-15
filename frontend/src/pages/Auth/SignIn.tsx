"use client";
import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock } from "lucide-react";
import { Input } from "../../component/Input";
import { Button } from "../../component/Button";
import { Card } from "../../component/AuthCard";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../../config";

export default function LoginForm() {
    const [form, setForm] = useState({ email: "", password: "" });
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
            const { data } = await axios.post(`${BASE_URL}/auth/login`, form, { withCredentials: true });
            setMessage({ type: "success", text: "Login successful! Redirecting..." });
            console.log(data);
            const userId = data.user.id;
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', userId);
            setTimeout(() => {
                navigate(`/${userId}/dashboard`);
            }, 1000);
        } catch (error: any) {
            const errorMsg =
                error.response?.data?.error || "Invalid credentials. Please try again.";
            setMessage({ type: "error", text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-lime-50 via-teal-50 to-white flex items-center justify-center px-4">
            <Card title="Welcome Back" subtitle="Login to continue your journey">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        icon={Mail}
                        value={form.email}
                        onChange={handleChange}
                    />

                    {/* Wrap the password input and link together */}
                    <div className="relative mb-10">
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            icon={Lock}
                            value={form.password}
                            onChange={handleChange}
                        />
                        <Link
                            to="/forgot-password"
                            className="absolute right-0 -bottom-6 text-sm text-teal-600 hover:underline mt-1 mr-1"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
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

                <div className="text-sm text-gray-500 text-center mt-4">
                    <p className="mt-2">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-teal-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );

}

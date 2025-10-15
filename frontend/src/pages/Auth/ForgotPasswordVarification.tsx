"use client";
import React, { useState } from "react";
import axios from "axios";
import { Mail } from "lucide-react";
import { Input } from "../../component/Input";
import { Button } from "../../component/Button";
import { Card } from "../../component/AuthCard";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../../config";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            console.log(email);
            const { data } = await axios.post(`${BASE_URL}/auth/password/forgot`, { email });
            setMessage({ type: "success", text: data.message || "If the email exists, a code has been sent." });

            setTimeout(() => {
                navigate("/reset-password", { state: { email } });
            }, 1000);
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || "Something went wrong.";
            setMessage({ type: "error", text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-lime-50 via-teal-50 to-white flex items-center justify-center px-4">
            <Card title="Forgot Password?" subtitle="Enter your email to receive a reset code">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        icon={Mail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Sending Code..." : "Send Code"}
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
                    Remember your password?{" "}
                    <Link to="/login" className="text-teal-600 hover:underline">
                        Login
                    </Link>
                </p>
            </Card>
        </div>
    );
}

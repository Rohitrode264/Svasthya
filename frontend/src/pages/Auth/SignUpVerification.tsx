"use client";
import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "../../component/Input";
import { Button } from "../../component/Button";
import { Card } from "../../component/AuthCard";
import { KeyRound } from "lucide-react";
import { BASE_URL } from "../../config";

export default function VerifyForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/register/verify`, { email, code });
      setMessage({ type: "success", text: "Verification successful! Redirecting..." });
        console.log(data);
      setTimeout(() => {
        navigate("/dashboard"); // or /login
      }, 1200);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error || "Invalid or expired code. Please try again.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-teal-50 to-white flex items-center justify-center px-4">
      <Card
        title="Verify Account"
        subtitle={`Enter the verification code sent to ${email}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Verification Code"
            name="code"
            placeholder="Enter 6-digit code"
            icon={KeyRound}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </Button>

          {message && (
            <p
              className={`text-center text-sm font-medium ${
                message.type === "success" ? "text-teal-600" : "text-red-500"
              }`}
            >
              {message.text}
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}

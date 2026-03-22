"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, Eye, EyeOff } from "lucide-react";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-nyu-light-violet via-white to-nyu-light-violet px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-nyu-violet rounded-2xl mb-4">
              <FlaskConical className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-nyu-violet">
              Decision Making Lab
            </h1>
            <p className="text-nyu-gray mt-1 text-sm">
              Competitive Strategy Course Tools
            </p>
          </div>

          {/* Login form */}
          <div className="bg-white rounded-xl shadow-lg border border-nyu-border p-8">
            <h2 className="text-lg font-semibold text-nyu-black mb-6">
              Sign in to your account
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-nyu-gray mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet focus:border-transparent transition-shadow"
                  placeholder="your.email@nyu.edu"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-nyu-gray mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet focus:border-transparent transition-shadow pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-nyu-gray hover:text-nyu-violet"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-nyu-violet text-white font-semibold text-sm hover:bg-nyu-ultra-violet disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-nyu-gray mt-6">
            Contact your instructor or administrator if you need an account.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

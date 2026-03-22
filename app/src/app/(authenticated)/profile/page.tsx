"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";

interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user);
        setFirstName(data.user.firstName);
        setLastName(data.user.lastName);
      });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const body: Record<string, string> = { firstName, lastName };
      if (newPassword) {
        if (!currentPassword) {
          setError("Current password is required to set a new password");
          setLoading(false);
          return;
        }
        body.password = newPassword;
      }

      const res = await fetch(`/api/users/${user?.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Update failed");
        return;
      }

      setMessage("Profile updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-nyu-violet border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-nyu-violet mb-8">Profile</h1>

      <div className="bg-white rounded-xl border border-nyu-border p-8">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-nyu-border">
          <div className="w-16 h-16 bg-nyu-violet rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-nyu-black">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-nyu-gray">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-nyu-light-violet text-nyu-violet text-xs font-medium rounded-full capitalize">
              {user.role.toLowerCase()}
            </span>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-nyu-gray mb-1.5">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2.5 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-nyu-gray mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2.5 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet"
              />
            </div>
          </div>

          <hr className="border-nyu-border" />

          <h3 className="font-medium text-nyu-black">Change Password</h3>

          <div>
            <label className="block text-sm font-medium text-nyu-gray mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-nyu-gray mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-nyu-violet text-white font-semibold text-sm hover:bg-nyu-ultra-violet disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

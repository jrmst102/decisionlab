"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, X, ChevronLeft, ChevronRight, Pencil } from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Create form state
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "STUDENT",
  });
  const [formError, setFormError] = useState("");

  // Edit form state
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
  });
  const [editError, setEditError] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const limit = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);

    const res = await fetch(`/api/users?${params}`);
    const data = await res.json();
    setUsers(data.users || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setFormError(data.error || "Failed to create user");
      return;
    }

    setShowCreate(false);
    setForm({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "STUDENT",
    });
    fetchUsers();
  };

  const toggleActive = async (userId: string, isActive: boolean) => {
    await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchUsers();
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setEditForm({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      password: "",
    });
    setEditError("");
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setEditSaving(true);
    setEditError("");

    const body: Record<string, string> = {};
    if (editForm.firstName !== editUser.firstName) body.firstName = editForm.firstName;
    if (editForm.lastName !== editUser.lastName) body.lastName = editForm.lastName;
    if (editForm.email !== editUser.email) body.email = editForm.email;
    if (editForm.role !== editUser.role) body.role = editForm.role;
    if (editForm.password) body.password = editForm.password;

    if (Object.keys(body).length === 0) {
      setEditUser(null);
      setEditSaving(false);
      return;
    }

    const res = await fetch(`/api/users/${editUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setEditError(data.error || "Failed to update user");
    } else {
      setEditUser(null);
      fetchUsers();
    }
    setEditSaving(false);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-nyu-violet">User Management</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-nyu-violet text-white rounded-lg text-sm font-medium hover:bg-nyu-ultra-violet transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nyu-gray" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet bg-white"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="PROFESSOR">Professor</option>
          <option value="STUDENT">Student</option>
        </select>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-nyu-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-nyu-light-gray border-b border-nyu-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-nyu-gray uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-nyu-gray uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-nyu-gray uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-nyu-gray uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-nyu-gray uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nyu-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-nyu-gray">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-nyu-gray">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-nyu-light-gray/50">
                    <td className="px-6 py-4 text-sm font-medium text-nyu-black">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-nyu-gray">
                      {u.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.role === "ADMIN"
                            ? "bg-red-100 text-red-700"
                            : u.role === "PROFESSOR"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEdit(u)}
                          className="text-sm text-nyu-violet hover:text-nyu-ultra-violet font-medium inline-flex items-center gap-1"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => toggleActive(u.id, u.isActive)}
                          className="text-sm text-nyu-violet hover:text-nyu-ultra-violet font-medium"
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-nyu-border">
            <p className="text-sm text-nyu-gray">
              Showing {(page - 1) * limit + 1}–
              {Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md hover:bg-nyu-light-violet disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-nyu-gray">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md hover:bg-nyu-light-violet disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-nyu-border">
              <h2 className="font-semibold text-nyu-black">Add New User</h2>
              <button
                onClick={() => setShowCreate(false)}
                className="text-nyu-gray hover:text-nyu-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-nyu-gray mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nyu-gray mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-nyu-gray mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nyu-gray mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nyu-gray mb-1">
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet bg-white"
                >
                  <option value="STUDENT">Student</option>
                  <option value="PROFESSOR">Professor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 text-sm font-medium text-nyu-gray hover:text-nyu-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-nyu-violet text-white rounded-lg text-sm font-medium hover:bg-nyu-ultra-violet transition-colors"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-nyu-border">
              <h2 className="font-semibold text-nyu-black">Edit User</h2>
              <button
                onClick={() => setEditUser(null)}
                className="text-nyu-gray hover:text-nyu-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEdit} className="p-6 space-y-4">
              {editError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {editError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-nyu-gray mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nyu-gray mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.lastName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-nyu-gray mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nyu-gray mb-1">
                  Role
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet bg-white"
                >
                  <option value="STUDENT">Student</option>
                  <option value="PROFESSOR">Professor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-nyu-gray mb-1">
                  New Password{" "}
                  <span className="text-nyu-gray font-normal">(leave blank to keep current)</span>
                </label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm({ ...editForm, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 text-sm font-medium text-nyu-gray hover:text-nyu-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="px-4 py-2 bg-nyu-violet text-white rounded-lg text-sm font-medium hover:bg-nyu-ultra-violet transition-colors disabled:opacity-50"
                >
                  {editSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

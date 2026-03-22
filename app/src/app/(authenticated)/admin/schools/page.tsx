"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, School, Trash2 } from "lucide-react";

interface SchoolItem {
  id: string;
  name: string;
  code: string;
  _count: { courses: number };
}

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function fetchSchools() {
    const res = await fetch("/api/schools");
    if (res.ok) {
      const data = await res.json();
      setSchools(data.schools);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchSchools();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/schools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), code: code.trim() }),
    });

    if (res.ok) {
      setName("");
      setCode("");
      setShowForm(false);
      fetchSchools();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create school");
    }
    setSaving(false);
  }

  async function handleDelete(schoolId: string, schoolName: string) {
    if (!confirm(`Delete "${schoolName}"? This cannot be undone.`)) return;
    setDeleteError(null);

    const res = await fetch(`/api/schools/${schoolId}`, { method: "DELETE" });
    if (res.ok) {
      fetchSchools();
    } else {
      const data = await res.json();
      setDeleteError(data.error || "Failed to delete school");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-nyu-gray hover:text-nyu-violet mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-nyu-violet">Schools</h1>
          <p className="text-nyu-gray mt-1">
            Manage schools that courses belong to.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-nyu-violet text-white text-sm font-medium rounded-lg hover:bg-nyu-dark-violet transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add School
        </button>
      </div>

      {/* Add school form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-nyu-border p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-nyu-black mb-4">
            New School
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-nyu-gray mb-1">
                School Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. NYU Stern School of Business"
                required
                className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:border-nyu-violet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-nyu-gray mb-1">
                Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. STERN"
                required
                className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:border-nyu-violet"
              />
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-nyu-violet text-white text-sm font-medium rounded-lg hover:bg-nyu-dark-violet disabled:opacity-50 transition-colors"
            >
              {saving ? "Creating…" : "Create School"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError(null);
              }}
              className="px-4 py-2 text-nyu-gray text-sm font-medium rounded-lg hover:bg-nyu-light-gray transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Schools list */}
      {deleteError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {deleteError}
        </div>
      )}
      <div className="bg-white rounded-xl border border-nyu-border">
        {loading ? (
          <div className="p-6 text-center text-nyu-gray text-sm">
            Loading…
          </div>
        ) : schools.length === 0 ? (
          <div className="p-6 text-center text-nyu-gray text-sm">
            No schools yet. Click &quot;Add School&quot; to create one.
          </div>
        ) : (
          <div className="divide-y divide-nyu-border">
            {schools.map((school) => (
              <div
                key={school.id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <School className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-nyu-black">
                      {school.name}
                    </p>
                    <p className="text-xs text-nyu-gray">{school.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-nyu-gray">
                    {school._count.courses}{" "}
                    {school._count.courses === 1 ? "course" : "courses"}
                  </span>
                  <button
                    onClick={() => handleDelete(school.id, school.name)}
                    className="text-nyu-gray hover:text-red-600 transition-colors"
                    title="Delete school"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

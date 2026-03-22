"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, BookOpen, Pencil, Trash2, X } from "lucide-react";

interface Course {
  id: string;
  name: string;
  code: string;
  semester: string;
  isActive: boolean;
  school: { id: string; name: string };
  professor: { id: string; firstName: string; lastName: string; email: string };
  _count: { enrollments: number };
}

interface SchoolOption {
  id: string;
  name: string;
  code: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    semester: "",
    schoolId: "",
  });

  // Edit state
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    code: "",
    semester: "",
    isActive: true,
  });
  const [editError, setEditError] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  async function fetchCourses() {
    const res = await fetch("/api/courses");
    if (res.ok) {
      const data = await res.json();
      setCourses(data.courses);
    }
    setLoading(false);
  }

  async function fetchSchools() {
    const res = await fetch("/api/schools");
    if (res.ok) {
      const data = await res.json();
      setSchools(data.schools);
    }
  }

  useEffect(() => {
    fetchCourses();
    fetchSchools();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        code: form.code.trim(),
        semester: form.semester.trim(),
        schoolId: form.schoolId,
      }),
    });

    if (res.ok) {
      setForm({ name: "", code: "", semester: "", schoolId: "" });
      setShowForm(false);
      fetchCourses();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create course");
    }
    setSaving(false);
  }

  function openEdit(course: Course) {
    setEditCourse(course);
    setEditForm({
      name: course.name,
      code: course.code,
      semester: course.semester,
      isActive: course.isActive,
    });
    setEditError(null);
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editCourse) return;
    setEditSaving(true);
    setEditError(null);

    const body: Record<string, unknown> = {};
    if (editForm.name !== editCourse.name) body.name = editForm.name;
    if (editForm.code !== editCourse.code) body.code = editForm.code;
    if (editForm.semester !== editCourse.semester) body.semester = editForm.semester;
    if (editForm.isActive !== editCourse.isActive) body.isActive = editForm.isActive;

    if (Object.keys(body).length === 0) {
      setEditCourse(null);
      setEditSaving(false);
      return;
    }

    const res = await fetch(`/api/courses/${editCourse.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setEditCourse(null);
      fetchCourses();
    } else {
      const data = await res.json();
      setEditError(data.error || "Failed to update course");
    }
    setEditSaving(false);
  }

  async function handleDelete(courseId: string, courseName: string) {
    if (!confirm(`Delete "${courseName}"? This will also remove all enrollments and tool assignments. This cannot be undone.`)) return;
    setDeleteError(null);

    const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
    if (res.ok) {
      fetchCourses();
    } else {
      const data = await res.json();
      setDeleteError(data.error || "Failed to delete course");
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-nyu-gray hover:text-nyu-violet mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-nyu-violet">Courses</h1>
          <p className="text-nyu-gray mt-1">Manage all courses.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-nyu-violet text-white text-sm font-medium rounded-lg hover:bg-nyu-dark-violet transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-nyu-border p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-nyu-black mb-4">
            New Course
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-nyu-gray mb-1">
                Course Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Strategic Decision Making"
                required
                className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:border-nyu-violet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-nyu-gray mb-1">
                Course Code
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. INTG1-GC1011"
                required
                className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:border-nyu-violet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-nyu-gray mb-1">
                Semester
              </label>
              <input
                type="text"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                placeholder="e.g. Spring 2026"
                required
                className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:border-nyu-violet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-nyu-gray mb-1">
                School
              </label>
              <select
                value={form.schoolId}
                onChange={(e) => setForm({ ...form, schoolId: e.target.value })}
                required
                className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:border-nyu-violet"
              >
                <option value="">Select a school…</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-nyu-violet text-white text-sm font-medium rounded-lg hover:bg-nyu-dark-violet disabled:opacity-50 transition-colors"
            >
              {saving ? "Creating…" : "Create Course"}
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

      {/* Courses list */}
      {deleteError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {deleteError}
        </div>
      )}
      <div className="bg-white rounded-xl border border-nyu-border">
        {loading ? (
          <div className="p-6 text-center text-nyu-gray text-sm">Loading…</div>
        ) : courses.length === 0 ? (
          <div className="p-6 text-center text-nyu-gray text-sm">
            No courses yet. Click &quot;Add Course&quot; to create one.
          </div>
        ) : (
          <div className="divide-y divide-nyu-border">
            {courses.map((course) => (
              <div
                key={course.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-nyu-light-gray/50 transition-colors"
              >
                <Link
                  href={`/manage/courses/${course.id}`}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <div className="p-2 rounded-lg bg-green-50 text-green-600 shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-nyu-black">
                      {course.name}
                    </p>
                    <p className="text-xs text-nyu-gray">
                      {course.code} &middot; {course.school.name} &middot;{" "}
                      {course.semester}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className="text-xs text-nyu-gray">
                    {course._count.enrollments} students
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      course.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {course.isActive ? "Active" : "Archived"}
                  </span>
                  <button
                    onClick={() => openEdit(course)}
                    className="text-nyu-gray hover:text-nyu-violet transition-colors"
                    title="Edit course"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id, course.name)}
                    className="text-nyu-gray hover:text-red-600 transition-colors"
                    title="Delete course"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Course Modal */}
      {editCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-nyu-border">
              <h2 className="font-semibold text-nyu-black">Edit Course</h2>
              <button
                onClick={() => setEditCourse(null)}
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

              <div>
                <label className="block text-sm font-medium text-nyu-gray mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nyu-gray mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  required
                  value={editForm.code}
                  onChange={(e) =>
                    setEditForm({ ...editForm, code: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nyu-gray mb-1">
                  Semester
                </label>
                <input
                  type="text"
                  required
                  value={editForm.semester}
                  onChange={(e) =>
                    setEditForm({ ...editForm, semester: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-nyu-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nyu-violet"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-nyu-gray cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) =>
                      setEditForm({ ...editForm, isActive: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-nyu-border text-nyu-violet focus:ring-nyu-violet"
                  />
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditCourse(null)}
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
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-nyu-gray">
                      {course._count.enrollments} students
                    </span>
                    <span className="text-xs text-nyu-gray">
                      Prof. {course.professor.lastName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        course.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {course.isActive ? "Active" : "Archived"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

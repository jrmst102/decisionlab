"use client";

import { useState } from "react";
import { Plus, X, Search } from "lucide-react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Enrollment {
  id: string;
  user: Student;
}

interface CourseEnrollmentEditorProps {
  courseId: string;
  enrollments: Enrollment[];
}

export default function CourseEnrollmentEditor({
  courseId,
  enrollments: initialEnrollments,
}: CourseEnrollmentEditorProps) {
  const [enrollments, setEnrollments] = useState(initialEnrollments);
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const enrolledIds = new Set(enrollments.map((e) => e.user.id));

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setMessage(null);

    const params = new URLSearchParams({
      search: searchQuery.trim(),
      role: "STUDENT",
      limit: "50",
    });
    const res = await fetch(`/api/users?${params}`);
    if (res.ok) {
      const data = await res.json();
      setSearchResults(data.users || []);
    }
    setSearching(false);
  }

  async function addStudent(student: Student) {
    setMessage(null);
    const res = await fetch(`/api/courses/${courseId}/enroll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: [student.id] }),
    });

    if (res.ok) {
      setEnrollments((prev) => [
        ...prev,
        { id: `new-${student.id}`, user: student },
      ]);
      setMessage(`Added ${student.firstName} ${student.lastName}`);
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to add student");
    }
  }

  async function removeStudent(userId: string) {
    const student = enrollments.find((e) => e.user.id === userId)?.user;
    if (!student) return;
    if (!confirm(`Remove ${student.firstName} ${student.lastName} from this course?`)) return;

    setMessage(null);
    const res = await fetch(`/api/courses/${courseId}/enroll`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: [userId] }),
    });

    if (res.ok) {
      setEnrollments((prev) => prev.filter((e) => e.user.id !== userId));
      setMessage(`Removed ${student.firstName} ${student.lastName}`);
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to remove student");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-nyu-gray">
          {enrollments.length} enrolled
        </span>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-1 text-sm font-medium text-nyu-violet hover:text-nyu-ultra-violet transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Student
        </button>
      </div>

      {/* Add student search */}
      {showAdd && (
        <div className="mb-4 p-3 bg-nyu-light-gray rounded-lg">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-nyu-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search students by name or email…"
                className="w-full pl-8 pr-3 py-1.5 border border-nyu-border rounded-md text-sm focus:outline-none focus:border-nyu-violet"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searching}
              className="px-3 py-1.5 bg-nyu-violet text-white text-sm rounded-md hover:bg-nyu-dark-violet disabled:opacity-50"
            >
              {searching ? "…" : "Search"}
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 max-h-40 overflow-y-auto divide-y divide-nyu-border rounded-md bg-white border border-nyu-border">
              {searchResults.map((s) => (
                <div
                  key={s.id}
                  className="px-3 py-2 flex items-center justify-between text-sm"
                >
                  <span>
                    {s.lastName}, {s.firstName}{" "}
                    <span className="text-nyu-gray">({s.email})</span>
                  </span>
                  {enrolledIds.has(s.id) ? (
                    <span className="text-xs text-nyu-gray">Enrolled</span>
                  ) : (
                    <button
                      onClick={() => addStudent(s)}
                      className="text-xs font-medium text-nyu-violet hover:text-nyu-ultra-violet"
                    >
                      Add
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {message && (
        <p className={`text-sm mb-3 ${message.startsWith("Failed") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}

      {/* Enrolled students list */}
      {enrollments.length === 0 ? (
        <p className="text-sm text-nyu-gray py-2">No students enrolled yet.</p>
      ) : (
        <div className="divide-y divide-nyu-border">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="py-2.5 flex items-center justify-between group"
            >
              <div>
                <p className="text-sm font-medium text-nyu-black">
                  {enrollment.user.lastName}, {enrollment.user.firstName}
                </p>
                <p className="text-xs text-nyu-gray">
                  {enrollment.user.email}
                </p>
              </div>
              <button
                onClick={() => removeStudent(enrollment.user.id)}
                className="text-nyu-gray hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                title="Remove student"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Users, Calendar } from "lucide-react";

export default async function ManageCoursesPage() {
  const user = await getSessionUser();
  if (!user || (user.role !== "PROFESSOR" && user.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const where =
    user.role === "PROFESSOR" ? { professorId: user.id } : {};

  const courses = await prisma.course.findMany({
    where,
    include: {
      school: true,
      _count: { select: { enrollments: true, toolAssignments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-nyu-violet">Manage Courses</h1>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-nyu-border">
          <BookOpen className="h-12 w-12 text-nyu-gray mx-auto mb-4" />
          <p className="text-nyu-gray">No courses yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/manage/courses/${course.id}`}
              className="block bg-white rounded-xl border border-nyu-border p-6 hover:border-nyu-violet hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-nyu-black text-lg">
                    {course.name}
                  </h3>
                  <p className="text-sm text-nyu-gray mt-1">
                    {course.code} &middot; {course.school.name}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    course.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {course.isActive ? "Active" : "Archived"}
                </span>
              </div>
              <div className="flex items-center gap-6 mt-4 text-sm text-nyu-gray">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {course.semester}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {course._count.enrollments} students
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  {course._count.toolAssignments} tools
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

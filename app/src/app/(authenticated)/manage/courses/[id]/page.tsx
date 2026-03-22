import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, BookOpen, Calendar, GraduationCap } from "lucide-react";
import CourseToolEditor from "@/components/CourseToolEditor";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user || (user.role !== "PROFESSOR" && user.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      school: true,
      professor: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      enrollments: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { user: { lastName: "asc" } },
      },
      toolAssignments: {
        include: { tool: true },
        orderBy: { tool: { sortOrder: "asc" } },
      },
    },
  });

  if (!course) {
    redirect("/manage/courses");
  }

  if (user.role === "PROFESSOR" && course.professorId !== user.id) {
    redirect("/manage/courses");
  }

  const allTools = await prisma.tool.findMany({
    select: { id: true, name: true, slug: true, isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const assignedToolIds = course.toolAssignments.map((a) => a.toolId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/manage/courses"
        className="inline-flex items-center gap-1.5 text-sm text-nyu-gray hover:text-nyu-violet mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      {/* Course header */}
      <div className="bg-white rounded-xl border border-nyu-border p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-nyu-violet">
              {course.name}
            </h1>
            <p className="text-nyu-gray mt-1">
              {course.code} &middot; {course.school.name}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              course.isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {course.isActive ? "Active" : "Archived"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-nyu-gray">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {course.semester}
          </span>
          <span className="flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4" />
            {course.professor.firstName} {course.professor.lastName}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {course.enrollments.length} students
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            {course.toolAssignments.length} tools assigned
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrolled Students */}
        <div className="bg-white rounded-xl border border-nyu-border p-6">
          <h2 className="text-lg font-semibold text-nyu-black mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-nyu-violet" />
            Enrolled Students ({course.enrollments.length})
          </h2>

          {course.enrollments.length === 0 ? (
            <p className="text-sm text-nyu-gray py-4">
              No students enrolled yet.
            </p>
          ) : (
            <div className="divide-y divide-nyu-border">
              {course.enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-nyu-black">
                      {enrollment.user.lastName}, {enrollment.user.firstName}
                    </p>
                    <p className="text-xs text-nyu-gray">
                      {enrollment.user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Tools */}
        <div className="bg-white rounded-xl border border-nyu-border p-6">
          <h2 className="text-lg font-semibold text-nyu-black mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-nyu-violet" />
            Assigned Tools
          </h2>

          <CourseToolEditor
            courseId={course.id}
            allTools={allTools}
            assignedToolIds={assignedToolIds}
          />
        </div>
      </div>
    </div>
  );
}

import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, BookOpen, School, Wrench, BarChart3 } from "lucide-react";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  const [userCount, courseCount, schoolCount, toolCount] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.school.count(),
    prisma.tool.count(),
  ]);

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  const stats = [
    {
      label: "Total Users",
      value: userCount,
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Courses",
      value: courseCount,
      icon: BookOpen,
      href: "/admin/courses",
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Schools",
      value: schoolCount,
      icon: School,
      href: "/admin/schools",
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Tools",
      value: toolCount,
      icon: Wrench,
      href: "/admin/tools",
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-nyu-violet">
          Admin Dashboard
        </h1>
        <p className="text-nyu-gray mt-1">
          Manage users, courses, schools, and tools.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-xl border border-nyu-border p-6 hover:shadow-md hover:border-nyu-violet transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-nyu-gray">{stat.label}</p>
                  <p className="text-3xl font-bold text-nyu-black mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-nyu-border">
          <div className="flex items-center justify-between px-6 py-4 border-b border-nyu-border">
            <h2 className="font-semibold text-nyu-black">Recent Users</h2>
            <Link
              href="/admin/users"
              className="text-sm text-nyu-violet hover:text-nyu-ultra-violet font-medium"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-nyu-border">
            {recentUsers.map((u) => (
              <div key={u.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-nyu-black">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="text-xs text-nyu-gray">{u.email}</p>
                </div>
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
              </div>
            ))}
            {recentUsers.length === 0 && (
              <p className="px-6 py-4 text-sm text-nyu-gray">No users yet.</p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl border border-nyu-border">
          <div className="px-6 py-4 border-b border-nyu-border">
            <h2 className="font-semibold text-nyu-black">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            <Link
              href="/admin/users?action=create"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-nyu-light-violet transition-colors"
            >
              <Users className="h-5 w-5 text-nyu-violet" />
              <span className="text-sm font-medium text-nyu-black">
                Add New User
              </span>
            </Link>
            <Link
              href="/admin/courses?action=create"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-nyu-light-violet transition-colors"
            >
              <BookOpen className="h-5 w-5 text-nyu-violet" />
              <span className="text-sm font-medium text-nyu-black">
                Create Course
              </span>
            </Link>
            <Link
              href="/admin/schools?action=create"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-nyu-light-violet transition-colors"
            >
              <School className="h-5 w-5 text-nyu-violet" />
              <span className="text-sm font-medium text-nyu-black">
                Add School
              </span>
            </Link>
            <Link
              href="/admin/tools"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-nyu-light-violet transition-colors"
            >
              <BarChart3 className="h-5 w-5 text-nyu-violet" />
              <span className="text-sm font-medium text-nyu-black">
                View Analytics
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

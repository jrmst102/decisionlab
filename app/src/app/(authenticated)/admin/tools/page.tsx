import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminToolsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  const tools = await prisma.tool.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { courseAssignments: true, userAssignments: true } },
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-nyu-violet mb-6">
        Tool Management
      </h1>

      <div className="bg-white rounded-xl border border-nyu-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-nyu-light-gray border-b border-nyu-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-nyu-gray uppercase">
                Tool
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-nyu-gray uppercase">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-nyu-gray uppercase">
                Auth Method
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-nyu-gray uppercase">
                Course Assignments
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-nyu-gray uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nyu-border">
            {tools.map((tool) => (
              <tr key={tool.id} className="hover:bg-nyu-light-gray/50">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-nyu-black">
                      {tool.name}
                    </p>
                    <p className="text-xs text-nyu-gray">{tool.slug}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-nyu-gray">
                  {tool.url || "—"}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-gray-100 text-gray-600">
                    {tool.authMethod}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm text-nyu-gray">
                  {tool._count.courseAssignments}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      tool.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {tool.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
            {tools.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-nyu-gray">
                  No tools configured. Run the seed script to populate tools.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

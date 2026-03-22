import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ToolCard from "@/components/ToolCard";
import { TOOL_DEFINITIONS } from "@/lib/tools";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  // Fetch tools from database
  let tools = await prisma.tool.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  // If no tools in DB yet, use the definitions as fallback display
  if (tools.length === 0) {
    tools = TOOL_DEFINITIONS.map((t, i) => ({
      id: t.slug,
      name: t.name,
      slug: t.slug,
      url: t.url,
      iconPath: null,
      description: t.description,
      authMethod: t.authMethod as "JWT_EXCHANGE" | "REDIRECT" | "IFRAME" | "TBD",
      isActive: t.available,
      sortOrder: i,
      createdAt: new Date(),
    }));
  }

  // For students, filter to assigned tools only
  if (user.role === "STUDENT") {
    const [courseToolIds, userToolIds] = await Promise.all([
      prisma.courseToolAssignment
        .findMany({
          where: {
            course: {
              enrollments: { some: { userId: user.id } },
              isActive: true,
            },
          },
          select: { toolId: true },
        })
        .then((r) => r.map((t) => t.toolId)),
      prisma.userToolAssignment
        .findMany({
          where: { userId: user.id },
          select: { toolId: true },
        })
        .then((r) => r.map((t) => t.toolId)),
    ]);

    const assignedIds = new Set([...courseToolIds, ...userToolIds]);
    if (assignedIds.size > 0) {
      tools = tools.filter((t) => assignedIds.has(t.id));
    }
    // If no assignments yet, show all tools (fresh setup)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-nyu-violet">
          Welcome, {user.firstName}
        </h1>
        <p className="text-nyu-gray mt-1">
          Select a tool below to get started with your decision-making exercises.
        </p>
      </div>

      {/* Tool Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-16">
          <p className="text-nyu-gray text-lg">
            No tools have been assigned yet. Contact your instructor.
          </p>
        </div>
      )}
    </div>
  );
}

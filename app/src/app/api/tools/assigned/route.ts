import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Admins and professors get all active tools
  if (session.role === "ADMIN" || session.role === "PROFESSOR") {
    const tools = await prisma.tool.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ tools });
  }

  // Students only get tools assigned via course enrollments or direct assignments
  const [courseTools, userTools] = await Promise.all([
    prisma.courseToolAssignment.findMany({
      where: {
        course: {
          enrollments: { some: { userId: session.userId } },
          isActive: true,
        },
      },
      include: { tool: true },
    }),
    prisma.userToolAssignment.findMany({
      where: { userId: session.userId },
      include: { tool: true },
    }),
  ]);

  // Deduplicate by tool ID
  const toolMap = new Map<string, typeof courseTools[0]["tool"]>();
  for (const ct of courseTools) {
    if (ct.tool.isActive) toolMap.set(ct.tool.id, ct.tool);
  }
  for (const ut of userTools) {
    if (ut.tool.isActive) toolMap.set(ut.tool.id, ut.tool);
  }

  const tools = Array.from(toolMap.values()).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  return NextResponse.json({ tools });
}

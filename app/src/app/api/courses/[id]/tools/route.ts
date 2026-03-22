import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "PROFESSOR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: courseId } = await params;

  try {
    const { toolIds } = await request.json();

    if (!Array.isArray(toolIds) || toolIds.length === 0) {
      return NextResponse.json(
        { error: "toolIds array is required" },
        { status: 400 }
      );
    }

    // Remove existing assignments, then add new ones
    await prisma.courseToolAssignment.deleteMany({ where: { courseId } });

    const assignments = await Promise.all(
      toolIds.map((toolId: string) =>
        prisma.courseToolAssignment.create({
          data: { courseId, toolId },
        })
      )
    );

    return NextResponse.json({ assignments }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
              role: true,
            },
          },
        },
      },
      toolAssignments: {
        include: { tool: true },
      },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  // Professors can only see their own courses
  if (
    session.role === "PROFESSOR" &&
    course.professorId !== session.userId
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ course });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "PROFESSOR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  if (session.role === "PROFESSOR" && course.professorId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.name) data.name = body.name.trim();
    if (body.code) data.code = body.code.trim();
    if (body.semester) data.semester = body.semester.trim();
    if (body.startDate !== undefined)
      data.startDate = body.startDate ? new Date(body.startDate) : null;
    if (body.endDate !== undefined)
      data.endDate = body.endDate ? new Date(body.endDate) : null;
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;

    const updated = await prisma.course.update({
      where: { id },
      data,
      include: { school: true },
    });

    return NextResponse.json({ course: updated });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  // Delete enrollments and tool assignments first, then the course
  await prisma.courseEnrollment.deleteMany({ where: { courseId: id } });
  await prisma.courseToolAssignment.deleteMany({ where: { courseId: id } });
  await prisma.course.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

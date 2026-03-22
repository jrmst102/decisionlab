import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "PROFESSOR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const where =
    session.role === "PROFESSOR"
      ? { professorId: session.userId }
      : {};

  const courses = await prisma.course.findMany({
    where,
    include: {
      school: true,
      professor: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ courses });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "PROFESSOR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { schoolId, name, code, semester, startDate, endDate, professorId } =
      await request.json();

    if (!schoolId || !name || !code || !semester) {
      return NextResponse.json(
        { error: "School, name, code, and semester are required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        schoolId,
        professorId: professorId || session.userId,
        name: name.trim(),
        code: code.trim(),
        semester: semester.trim(),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        school: true,
        professor: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

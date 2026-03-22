import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const school = await prisma.school.findUnique({
    where: { id },
    include: { _count: { select: { courses: true } } },
  });

  if (!school) {
    return NextResponse.json({ error: "School not found" }, { status: 404 });
  }

  if (school._count.courses > 0) {
    return NextResponse.json(
      { error: "Cannot delete a school that has courses. Remove the courses first." },
      { status: 400 }
    );
  }

  await prisma.school.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

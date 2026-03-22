import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcryptjs from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // Create admin user
  const adminPassword = await bcryptjs.hash("AdminPass2026!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@decisionlab.com" },
    update: {},
    create: {
      email: "admin@decisionlab.com",
      passwordHash: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
    },
  });
  console.log(`✓ Admin user: ${admin.email}`);

  // Create demo professor
  const profPassword = await bcryptjs.hash("ProfPass2026!", 12);
  const professor = await prisma.user.upsert({
    where: { email: "professor@decisionlab.com" },
    update: {},
    create: {
      email: "professor@decisionlab.com",
      passwordHash: profPassword,
      firstName: "Jose",
      lastName: "Mendoza",
      role: "PROFESSOR",
    },
  });
  console.log(`✓ Professor: ${professor.email}`);

  // Create demo student
  const studentPassword = await bcryptjs.hash("StudentPass2026!", 12);
  const student = await prisma.user.upsert({
    where: { email: "student@decisionlab.com" },
    update: {},
    create: {
      email: "student@decisionlab.com",
      passwordHash: studentPassword,
      firstName: "Demo",
      lastName: "Student",
      role: "STUDENT",
    },
  });
  console.log(`✓ Student: ${student.email}`);

  // Create school
  const school = await prisma.school.upsert({
    where: { code: "STERN" },
    update: {},
    create: {
      name: "NYU Stern School of Business",
      code: "STERN",
    },
  });
  console.log(`✓ School: ${school.name}`);

  // Create tools
  const toolData = [
    {
      name: "AHP Studio",
      slug: "ahp-studio",
      url: "https://www.ahpstudio.com",
      description:
        "Structured multi-criteria decision making through pairwise comparisons and priority analysis.",
      authMethod: "JWT_EXCHANGE" as const,
      sortOrder: 1,
    },
    {
      name: "Airlines Sim",
      slug: "airlines-sim",
      url: "https://www.airlines-sim.com",
      description:
        "Competitive airline industry simulation — manage pricing, capacity, and strategy across rounds.",
      authMethod: "REDIRECT" as const,
      sortOrder: 2,
    },
    {
      name: "Dynamic Pricing Sandbox",
      slug: "dynamic-pricing",
      url: "https://www.pricingsandbox.com",
      description:
        "Real-time dynamic pricing simulation across four progressively challenging industry scenarios.",
      authMethod: "IFRAME" as const,
      sortOrder: 3,
    },
    {
      name: "Negotiation Sim",
      slug: "negotiation-sim",
      url: "",
      description:
        "AI-powered negotiation simulation with structured rounds, scoring rubric, and class session mode.",
      authMethod: "TBD" as const,
      isActive: false,
      sortOrder: 4,
    },
    {
      name: "Scenario Sim",
      slug: "scenario-sim",
      url: "",
      description:
        "Develop, analyze, and compare future scenarios for strategic decision making under uncertainty.",
      authMethod: "TBD" as const,
      isActive: false,
      sortOrder: 5,
    },
    {
      name: "Decision Trees",
      slug: "decision-trees",
      url: "",
      description:
        "Build and analyze decision trees with probability nodes, expected values, and sensitivity analysis.",
      authMethod: "TBD" as const,
      isActive: false,
      sortOrder: 6,
    },
  ];

  for (const tool of toolData) {
    const created = await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: { url: tool.url, description: tool.description },
      create: tool,
    });
    console.log(
      `✓ Tool: ${created.name} ${created.isActive ? "(active)" : "(coming soon)"}`
    );
  }

  // Create demo course
  const course = await prisma.course.upsert({
    where: {
      id: (
        await prisma.course.findFirst({
          where: { code: "STRT-6000", semester: "Spring 2026" },
        })
      )?.id || "00000000-0000-0000-0000-000000000000",
    },
    update: {},
    create: {
      schoolId: school.id,
      professorId: professor.id,
      name: "Competitive Strategy",
      code: "STRT-6000",
      semester: "Spring 2026",
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-05-15"),
    },
  });
  console.log(`✓ Course: ${course.name} (${course.code})`);

  // Enroll student in course
  await prisma.courseEnrollment.upsert({
    where: {
      userId_courseId: { userId: student.id, courseId: course.id },
    },
    update: {},
    create: {
      userId: student.id,
      courseId: course.id,
    },
  });
  console.log(`✓ Enrolled ${student.email} in ${course.code}`);

  // Assign active tools to course
  const activeTools = await prisma.tool.findMany({
    where: { isActive: true },
  });
  for (const tool of activeTools) {
    await prisma.courseToolAssignment.upsert({
      where: {
        courseId_toolId: { courseId: course.id, toolId: tool.id },
      },
      update: {},
      create: {
        courseId: course.id,
        toolId: tool.id,
      },
    });
  }
  console.log(`✓ Assigned ${activeTools.length} tools to ${course.code}`);

  console.log("\n✅ Seed complete!\n");
  console.log("Login credentials:");
  console.log("  Admin:     admin@decisionlab.com / AdminPass2026!");
  console.log("  Professor: professor@decisionlab.com / ProfPass2026!");
  console.log("  Student:   student@decisionlab.com / StudentPass2026!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcryptjs from "bcryptjs";
import "dotenv/config";

function stripSslMode(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.delete("sslmode");
    return u.toString();
  } catch {
    return url;
  }
}

const pool = new pg.Pool({
  connectionString: stripSslMode(process.env.DATABASE_URL || ""),
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool as unknown as ConstructorParameters<typeof PrismaPg>[0]);
const prisma = new PrismaClient({ adapter });

// Classlist data
const classlist = [
  { firstName: "Jose", lastName: "Mendoza", email: "jm10697@nyu.edu", password: "LimeKoala1!", role: "ADMIN" as const },
  { firstName: "Jose", lastName: "Mendoza", email: "josermendoza@icloud.com", password: "LimeKoala1!", role: "PROFESSOR" as const },
  { firstName: "Montserrat", lastName: "Avila Muñoz", email: "ma9876@nyu.edu", password: "RedLion1", role: "STUDENT" as const },
  { firstName: "Carlos", lastName: "Bernal", email: "cab10151@nyu.edu", password: "BlueTiger2", role: "STUDENT" as const },
  { firstName: "Annika", lastName: "Brown", email: "anb6060@nyu.edu", password: "GreenBear3", role: "STUDENT" as const },
  { firstName: "Valerie", lastName: "Cadena", email: "vac340@nyu.edu", password: "YellowWolf4", role: "STUDENT" as const },
  { firstName: "Juan Pablo", lastName: "Cajiga Gordillo", email: "jcg533@nyu.edu", password: "OrangeDeer5", role: "STUDENT" as const },
  { firstName: "Charlotte", lastName: "Detwiler", email: "cd4020@nyu.edu", password: "PurpleEagle6", role: "STUDENT" as const },
  { firstName: "Chris", lastName: "Dillmeier", email: "cwd8685@nyu.edu", password: "WhiteFox7", role: "STUDENT" as const },
  { firstName: "Xuke", lastName: "Feng", email: "xf931@nyu.edu", password: "BlackHawk8", role: "STUDENT" as const },
  { firstName: "Keri", lastName: "Kaleja", email: "kk5887@nyu.edu", password: "SilverLynx9", role: "STUDENT" as const },
  { firstName: "Hallie", lastName: "Lau", email: "hl6614@nyu.edu", password: "GoldPanda1", role: "STUDENT" as const },
  { firstName: "Natalie", lastName: "Lee", email: "nl3125@nyu.edu", password: "BrownOtter2", role: "STUDENT" as const },
  { firstName: "Jiayi", lastName: "Li", email: "jl17781@nyu.edu", password: "TealRaven3", role: "STUDENT" as const },
  { firstName: "Xinjue", lastName: "Li", email: "xl6160@nyu.edu", password: "PinkShark4", role: "STUDENT" as const },
  { firstName: "Cheryl", lastName: "Liang", email: "chl6920@nyu.edu", password: "GrayWhale5", role: "STUDENT" as const },
  { firstName: "Weilin", lastName: "Liang", email: "wl3557@nyu.edu", password: "VioletZebra6", role: "STUDENT" as const },
  { firstName: "Camila", lastName: "Lievano", email: "mcl9746@nyu.edu", password: "IndigoSwan7", role: "STUDENT" as const },
  { firstName: "Skylar", lastName: "Lin", email: "rl5858@nyu.edu", password: "MaroonOwl8", role: "STUDENT" as const },
  { firstName: "Juliana", lastName: "Martinez Aparicio", email: "jm11756@nyu.edu", password: "NavyFalcon9", role: "STUDENT" as const },
  { firstName: "Kristen", lastName: "Miao", email: "jm11696@nyu.edu", password: "AquaDolphin2", role: "STUDENT" as const },
  { firstName: "Vanessa Cibelle", lastName: "Moura Caxias", email: "vm2806@nyu.edu", password: "CoralCheetah3", role: "STUDENT" as const },
  { firstName: "Jiaying", lastName: "Pan", email: "jp7862@nyu.edu", password: "BeigeBadger4", role: "STUDENT" as const },
  { firstName: "Sasha", lastName: "Rachmadi", email: "sfr9778@nyu.edu", password: "CyanCobra5", role: "STUDENT" as const },
  { firstName: "Lanie", lastName: "Veazey", email: "lmv9494@nyu.edu", password: "OliveOcelot7", role: "STUDENT" as const },
  { firstName: "Senette", lastName: "Wiah", email: "sw7168@nyu.edu", password: "MagentaMoose6", role: "STUDENT" as const },
  { firstName: "Fangyuan", lastName: "Zheng", email: "fz2481@nyu.edu", password: "PeachPython8", role: "STUDENT" as const },
  { firstName: "Haihua", lastName: "Zhu", email: "hz4386@nyu.edu", password: "RubyRhino9", role: "STUDENT" as const },
];

async function main() {
  console.log("🌱 Seeding database...\n");

  // Create all users from classlist
  const users: Record<string, { id: string; email: string; role: string }> = {};
  for (const entry of classlist) {
    const passwordHash = await bcryptjs.hash(entry.password, 12);
    const user = await prisma.user.upsert({
      where: { email: entry.email },
      update: {},
      create: {
        email: entry.email,
        passwordHash,
        firstName: entry.firstName,
        lastName: entry.lastName,
        role: entry.role,
      },
    });
    users[user.email] = { id: user.id, email: user.email, role: user.role };
    const roleLabel = entry.role === "ADMIN" ? "Admin" : entry.role === "PROFESSOR" ? "Professor" : "Student";
    console.log(`✓ ${roleLabel}: ${user.firstName} ${user.lastName} (${user.email})`);
  }

  // Also create the admin alias (jose.mendoza@nyu.edu → jm10697@nyu.edu is the admin)
  // The jm10697@nyu.edu account is the primary admin account

  // Create school
  const school = await prisma.school.upsert({
    where: { code: "SPS" },
    update: {},
    create: {
      name: "NYU School of Professional Studies",
      code: "SPS",
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

  // Create demo course (professor is the icloud account or the nyu admin — use admin as professor for the course)
  const professorUser = users["josermendoza@icloud.com"] || users["jm10697@nyu.edu"];
  const course = await prisma.course.upsert({
    where: {
      id: (
        await prisma.course.findFirst({
          where: { code: "INTG1-GC1011", semester: "Spring 2026" },
        })
      )?.id || "00000000-0000-0000-0000-000000000000",
    },
    update: {},
    create: {
      schoolId: school.id,
      professorId: professorUser.id,
      name: "Competitive Strategy",
      code: "INTG1-GC1011",
      semester: "Spring 2026",
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-05-15"),
    },
  });
  console.log(`✓ Course: ${course.name} (${course.code})`);

  // Enroll all students in course
  const students = Object.values(users).filter((u) => u.role === "STUDENT");
  for (const student of students) {
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
  }
  console.log(`✓ Enrolled ${students.length} students in ${course.code}`);


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
  console.log("  Admin:     jm10697@nyu.edu / LimeKoala1!");
  console.log("  Professor: josermendoza@icloud.com / LimeKoala1!");
  console.log(`  Students:  ${students.length} students seeded (see classlist.csv for passwords)`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

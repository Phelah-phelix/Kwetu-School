const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Kwetu School data...");

  // --- Subjects ---
  const subjects = await Promise.all(
    ["Mathematics", "English", "Kiswahili", "Biology", "Chemistry", "Computer Science"].map(
      (name) => prisma.subject.upsert({ where: { name }, update: {}, create: { name } })
    )
  );

  // --- Classes ---
  const classA = await prisma.class.create({
    data: { name: "Grade 10 East", gradeLevel: 10, pathway: "STEM" },
  });
  const classB = await prisma.class.create({
    data: { name: "Grade 11 STEM A", gradeLevel: 11, pathway: "STEM" },
  });

  // --- Teacher user + profile ---
  const teacherPasswordHash = await bcrypt.hash("TeacherPass123!", 10);
  const teacherUser = await prisma.user.create({
    data: {
      email: "teacher@kwetu.ac.ke",
      passwordHash: teacherPasswordHash,
      fullName: "Grace Wanjiru",
      role: "TEACHER",
      teacherProfile: {
        create: {
          staffNumber: "TSC-0001",
          tscNumber: "T123456",
          specialization: "Mathematics",
        },
      },
    },
    include: { teacherProfile: true },
  });

  // Assign teacher to teach Mathematics in both classes
  await prisma.teacherAssignment.create({
    data: {
      teacherId: teacherUser.teacherProfile.id,
      classId: classA.id,
      subjectId: subjects.find((s) => s.name === "Mathematics").id,
    },
  });
  await prisma.teacherAssignment.create({
    data: {
      teacherId: teacherUser.teacherProfile.id,
      classId: classB.id,
      subjectId: subjects.find((s) => s.name === "Mathematics").id,
    },
  });

  // --- Parent user + profile ---
  const parentPasswordHash = await bcrypt.hash("ParentPass123!", 10);
  const parentUser = await prisma.user.create({
    data: {
      email: "parent@kwetu.ac.ke",
      passwordHash: parentPasswordHash,
      fullName: "James Otieno",
      role: "PARENT",
      parentProfile: { create: { occupation: "Engineer" } },
    },
    include: { parentProfile: true },
  });

  // --- Student users + profiles ---
  const studentPasswordHash = await bcrypt.hash("StudentPass123!", 10);

  const student1 = await prisma.user.create({
    data: {
      email: "student1@kwetu.ac.ke",
      passwordHash: studentPasswordHash,
      fullName: "Brian Otieno",
      role: "STUDENT",
      studentProfile: {
        create: {
          admissionNumber: "KW-2026-001",
          pathway: "STEM",
          classId: classA.id,
          parentId: parentUser.parentProfile.id,
        },
      },
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "student2@kwetu.ac.ke",
      passwordHash: studentPasswordHash,
      fullName: "Faith Achieng",
      role: "STUDENT",
      studentProfile: {
        create: {
          admissionNumber: "KW-2026-002",
          pathway: "STEM",
          classId: classB.id,
        },
      },
    },
  });

  // --- Worker user + profile ---
  const workerPasswordHash = await bcrypt.hash("WorkerPass123!", 10);
  await prisma.user.create({
    data: {
      email: "worker@kwetu.ac.ke",
      passwordHash: workerPasswordHash,
      fullName: "Samuel Kimani",
      role: "WORKER",
      workerProfile: {
        create: {
          staffNumber: "WK-0001",
          department: "Admin Office",
          jobTitle: "Office Clerk",
        },
      },
    },
  });

  // --- Principal user (no separate profile model, just a User row) ---
  const principalPasswordHash = await bcrypt.hash("PrincipalPass123!", 10);
  await prisma.user.create({
    data: {
      email: "principal@kwetu.ac.ke",
      passwordHash: principalPasswordHash,
      fullName: "Dr. Mary Njoroge",
      role: "PRINCIPAL",
    },
  });

  console.log("Seeding complete.");
  console.log("Test accounts (all passwords shown are for local dev only):");
  console.log("  admin@kwetu.ac.ke       / AdminPass123!");
  console.log("  teacher@kwetu.ac.ke     / TeacherPass123!");
  console.log("  parent@kwetu.ac.ke      / ParentPass123!");
  console.log("  student1@kwetu.ac.ke    / StudentPass123!");
  console.log("  student2@kwetu.ac.ke    / StudentPass123!");
  console.log("  worker@kwetu.ac.ke      / WorkerPass123!");
  console.log("  principal@kwetu.ac.ke   / PrincipalPass123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

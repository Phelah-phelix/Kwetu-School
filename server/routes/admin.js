const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// All admin routes require a valid token AND the ADMIN role
router.use(requireAuth, requireRole("ADMIN"));

router.get("/stats", async (req, res) => {
  try {
    const [studentCount, teacherCount, classCount, openAssignments] =
      await Promise.all([
        prisma.student.count(),
        prisma.teacher.count(),
        prisma.class.count(),
        prisma.assignment.count({ where: { dueDate: { gte: new Date() } } }),
      ]);

    res.json({
      students: studentCount,
      teachers: teacherCount,
      classes: classCount,
      openAssignments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load stats." });
  }
});

module.exports = router;

// GET /api/admin/users — list all users, optionally filtered by role
router.get("/users", async (req, res) => {
  try {
    const { role } = req.query;
    const users = await prisma.user.findMany({
      where: role ? { role } : {},
      select: {
        id: true, email: true, fullName: true, role: true, active: true, createdAt: true,
        studentProfile: { select: { admissionNumber: true, classId: true } },
        teacherProfile: { select: { staffNumber: true } },
        workerProfile: { select: { staffNumber: true, department: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load users." });
  }
});

// POST /api/admin/users — create a user of any role, with the matching profile
router.post("/users", async (req, res) => {
  try {
    const bcrypt = require("bcrypt");
    const {
      email, password, fullName, role, phone,
      // role-specific fields (only the relevant ones are used)
      admissionNumber, birthCertificateNumber, nationalId, pathway, classId, parentId,
      staffNumber, tscNumber, specialization,
      occupation, address,
      department, jobTitle,
    } = req.body;

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ error: "email, password, fullName, and role are required." });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already registered." });

    const passwordHash = await bcrypt.hash(password, 10);

    const profileData = {};
    if (role === "STUDENT") {
      if (!admissionNumber) return res.status(400).json({ error: "admissionNumber is required for students." });
      profileData.studentProfile = {
        create: { admissionNumber, birthCertificateNumber, nationalId, pathway, classId, parentId },
      };
    } else if (role === "TEACHER") {
      if (!staffNumber) return res.status(400).json({ error: "staffNumber is required for teachers." });
      profileData.teacherProfile = { create: { staffNumber, tscNumber, specialization } };
    } else if (role === "PARENT") {
      profileData.parentProfile = { create: { occupation, address } };
    } else if (role === "WORKER") {
      if (!staffNumber || !department || !jobTitle) {
        return res.status(400).json({ error: "staffNumber, department, and jobTitle are required for workers." });
      }
      profileData.workerProfile = { create: { staffNumber, department, jobTitle } };
    }
    // ADMIN and PRINCIPAL have no extra profile table

    const user = await prisma.user.create({
      data: { email, passwordHash, fullName, role, phone, ...profileData },
    });

    res.status(201).json({ id: user.id, email: user.email, fullName: user.fullName, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to create user." });
  }
});

// PATCH /api/admin/users/:id/active — activate/deactivate a user (soft delete)
router.patch("/users/:id/active", async (req, res) => {
  try {
    const { active } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { active: Boolean(active) },
    });
    res.json({ id: user.id, active: user.active });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user." });
  }
});

// GET /api/admin/classes — for dropdowns when creating students
router.get("/classes", async (req, res) => {
  try {
    const classes = await prisma.class.findMany({ orderBy: { gradeLevel: "asc" } });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: "Failed to load classes." });
  }
});

// POST /api/admin/classes — create a class
router.post("/classes", async (req, res) => {
  try {
    const { name, gradeLevel, pathway } = req.body;
    if (!name || !gradeLevel) return res.status(400).json({ error: "name and gradeLevel are required." });
    const created = await prisma.class.create({ data: { name, gradeLevel: Number(gradeLevel), pathway } });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: "Failed to create class." });
  }
});

// GET /api/admin/subjects — for dropdowns
router.get("/subjects", async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({ orderBy: { name: "asc" } });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: "Failed to load subjects." });
  }
});

// POST /api/admin/assignments — assign a teacher to teach a subject in a class
router.post("/assignments", async (req, res) => {
  try {
    const { teacherId, classId, subjectId } = req.body;
    if (!teacherId || !classId || !subjectId) {
      return res.status(400).json({ error: "teacherId, classId, and subjectId are required." });
    }
    const created = await prisma.teacherAssignment.create({
      data: { teacherId, classId, subjectId },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    if (err.code === "P2002") {
      return res.status(409).json({ error: "This teacher is already assigned to this subject/class." });
    }
    res.status(500).json({ error: "Failed to create assignment." });
  }
});

// GET /api/admin/teachers — for dropdowns
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: { user: { select: { fullName: true } } },
    });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: "Failed to load teachers." });
  }
});

// GET /api/admin/timetable/:classId — full weekly timetable for a class
router.get("/timetable/:classId", async (req, res) => {
  try {
    const slots = await prisma.timetableSlot.findMany({
      where: { classId: req.params.classId },
      include: { subject: true, teacher: { include: { user: { select: { fullName: true } } } } },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: "Failed to load timetable." });
  }
});

// POST /api/admin/timetable — create one timetable slot
router.post("/timetable", async (req, res) => {
  try {
    const { classId, subjectId, teacherId, dayOfWeek, startTime, endTime } = req.body;
    if (!classId || !subjectId || !teacherId || !dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const slot = await prisma.timetableSlot.create({
      data: { classId, subjectId, teacherId, dayOfWeek: Number(dayOfWeek), startTime, endTime },
    });
    res.status(201).json(slot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create timetable slot." });
  }
});

// GET /api/admin/quizzes — list all holiday quizzes
router.get("/quizzes", async (req, res) => {
  try {
    const quizzes = await prisma.holidayQuiz.findMany({
      include: { subject: true, questions: true, attempts: true },
      orderBy: { openDate: "desc" },
    });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: "Failed to load quizzes." });
  }
});

// POST /api/admin/quizzes — create a quiz with its questions in one go
router.post("/quizzes", async (req, res) => {
  try {
    const { title, subjectId, gradeLevel, openDate, closeDate, questions } = req.body;

    if (!title || !subjectId || !gradeLevel || !openDate || !closeDate || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "title, subjectId, gradeLevel, openDate, closeDate, and at least one question are required." });
    }

    for (const q of questions) {
      if (!q.question || !q.optionA || !q.optionB || !q.optionC || !q.optionD || !q.correctOption) {
        return res.status(400).json({ error: "Each question needs text, 4 options, and a correctOption." });
      }
    }

    const quiz = await prisma.holidayQuiz.create({
      data: {
        title,
        subjectId,
        gradeLevel: Number(gradeLevel),
        openDate: new Date(openDate),
        closeDate: new Date(closeDate),
        questions: { create: questions },
      },
      include: { questions: true },
    });

    res.status(201).json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create quiz." });
  }
});

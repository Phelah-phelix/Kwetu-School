const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth, requireRole("TEACHER"));

// Helper: get the Teacher profile id for the logged-in user
async function getTeacherId(userId) {
  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) throw new Error("Teacher profile not found.");
  return teacher.id;
}

// GET /api/teacher/classes — classes + subjects this teacher is assigned to
router.get("/classes", async (req, res) => {
  try {
    const teacherId = await getTeacherId(req.user.userId);

    const assignments = await prisma.teacherAssignment.findMany({
      where: { teacherId },
      include: {
        class: true,
        subject: true,
      },
    });

    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to load classes." });
  }
});

// GET /api/teacher/classes/:classId/students — student roster for a class
router.get("/classes/:classId/students", async (req, res) => {
  try {
    const teacherId = await getTeacherId(req.user.userId);

    // Confirm this teacher is actually assigned to this class
    const assignment = await prisma.teacherAssignment.findFirst({
      where: { teacherId, classId: req.params.classId },
    });
    if (!assignment) {
      return res.status(403).json({ error: "You are not assigned to this class." });
    }

    const students = await prisma.student.findMany({
      where: { classId: req.params.classId },
      include: { user: { select: { fullName: true, email: true } } },
    });

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to load students." });
  }
});

// POST /api/teacher/performance — record a CBC performance entry
router.post("/performance", async (req, res) => {
  try {
    const teacherId = await getTeacherId(req.user.userId);
    const { studentId, subjectId, term, year, score, competencyLevel, remarks } = req.body;

    if (!studentId || !subjectId || !term || !year || score == null || !competencyLevel) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const record = await prisma.performanceRecord.create({
      data: {
        studentId,
        subjectId,
        teacherId,
        term,
        year: Number(year),
        score: Number(score),
        competencyLevel,
        remarks,
      },
    });

    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to record performance." });
  }
});

module.exports = router;

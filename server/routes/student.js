const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth, requireRole("STUDENT"));

async function getStudentId(userId) {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new Error("Student profile not found.");
  return student.id;
}

// GET /api/student/me — profile + class info
router.get("/me", async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.userId },
      include: {
        user: { select: { fullName: true, email: true } },
        class: true,
      },
    });
    if (!student) return res.status(404).json({ error: "Student profile not found." });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load profile." });
  }
});

// GET /api/student/performance — all recorded grades
router.get("/performance", async (req, res) => {
  try {
    const studentId = await getStudentId(req.user.userId);
    const records = await prisma.performanceRecord.findMany({
      where: { studentId },
      include: { subject: true },
      orderBy: [{ year: "desc" }, { term: "desc" }],
    });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to load performance." });
  }
});

// GET /api/student/timetable — this student's class timetable
router.get("/timetable", async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.userId } });
    if (!student?.classId) return res.json([]);

    const slots = await prisma.timetableSlot.findMany({
      where: { classId: student.classId },
      include: { subject: true, teacher: { include: { user: { select: { fullName: true } } } } },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load timetable." });
  }
});

// GET /api/student/holiday-quizzes — open quizzes for their grade level
router.get("/holiday-quizzes", async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.userId },
      include: { class: true },
    });
    if (!student?.class) return res.json([]);

    const quizzes = await prisma.holidayQuiz.findMany({
      where: {
        gradeLevel: student.class.gradeLevel,
        openDate: { lte: new Date() },
        closeDate: { gte: new Date() },
      },
      include: {
        subject: true,
        attempts: { where: { studentId: student.id } },
      },
    });
    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load quizzes." });
  }
});

module.exports = router;

// GET /api/student/assignments — assignments for this student's class
router.get("/assignments", async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ where: { userId: req.user.userId } });
    if (!student?.classId) return res.json([]);

    const assignments = await prisma.assignment.findMany({
      where: { classId: student.classId },
      include: {
        subject: true,
        submissions: { where: { studentId: student.id } },
      },
      orderBy: { dueDate: "asc" },
    });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: "Failed to load assignments." });
  }
});

// POST /api/student/assignments/:id/submit — mark an assignment as submitted
router.post("/assignments/:id/submit", async (req, res) => {
  try {
    const studentId = await getStudentId(req.user.userId);
    const submission = await prisma.assignmentSubmission.upsert({
      where: { assignmentId_studentId: { assignmentId: req.params.id, studentId } },
      update: { submittedAt: new Date(), fileUrl: req.body.fileUrl || null },
      create: {
        assignmentId: req.params.id,
        studentId,
        submittedAt: new Date(),
        fileUrl: req.body.fileUrl || null,
      },
    });
    res.status(201).json(submission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit assignment." });
  }
});

// GET /api/student/holiday-quizzes/:id — a single quiz with questions (answers hidden)
router.get("/holiday-quizzes/:id", async (req, res) => {
  try {
    const quiz = await prisma.holidayQuiz.findUnique({
      where: { id: req.params.id },
      include: {
        subject: true,
        questions: {
          select: { id: true, question: true, optionA: true, optionB: true, optionC: true, optionD: true },
        },
      },
    });
    if (!quiz) return res.status(404).json({ error: "Quiz not found." });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: "Failed to load quiz." });
  }
});

// POST /api/student/holiday-quizzes/:id/attempt — submit answers, get auto-graded score
router.post("/holiday-quizzes/:id/attempt", async (req, res) => {
  try {
    const studentId = await getStudentId(req.user.userId);
    const { answers } = req.body; // { questionId: "A" | "B" | "C" | "D", ... }

    const quiz = await prisma.holidayQuiz.findUnique({
      where: { id: req.params.id },
      include: { questions: true },
    });
    if (!quiz) return res.status(404).json({ error: "Quiz not found." });

    const existing = await prisma.quizAttempt.findUnique({
      where: { quizId_studentId: { quizId: quiz.id, studentId } },
    });
    if (existing) return res.status(409).json({ error: "You have already attempted this quiz." });

    let correctCount = 0;
    for (const q of quiz.questions) {
      if (answers[q.id] === q.correctOption) correctCount++;
    }
    const score = Math.round((correctCount / quiz.questions.length) * 100);

    const attempt = await prisma.quizAttempt.create({
      data: { quizId: quiz.id, studentId, score },
    });

    res.status(201).json({ score, correctCount, total: quiz.questions.length, attempt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit quiz." });
  }
});

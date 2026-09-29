const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth, requireRole("PRINCIPAL"));

router.get("/overview", async (req, res) => {
  try {
    const [studentCount, teacherCount, classCount, workerCount, recentPerformance] =
      await Promise.all([
        prisma.student.count(),
        prisma.teacher.count(),
        prisma.class.count(),
        prisma.worker.count(),
        prisma.performanceRecord.findMany({
          take: 10,
          orderBy: { recordedAt: "desc" },
          include: {
            student: { include: { user: { select: { fullName: true } } } },
            subject: true,
            teacher: { include: { user: { select: { fullName: true } } } },
          },
        }),
      ]);

    res.json({
      students: studentCount,
      teachers: teacherCount,
      classes: classCount,
      workers: workerCount,
      recentPerformance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load overview." });
  }
});

router.get("/classes", async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        students: true,
        assignments: {
          include: {
            teacher: { include: { user: { select: { fullName: true } } } },
            subject: true,
          },
        },
      },
    });
    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load classes." });
  }
});

module.exports = router;

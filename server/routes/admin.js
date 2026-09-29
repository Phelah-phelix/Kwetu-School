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

const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth, requireRole("PARENT"));

async function getParentId(userId) {
  const parent = await prisma.parent.findUnique({ where: { userId } });
  if (!parent) throw new Error("Parent profile not found.");
  return parent.id;
}

// GET /api/parent/children — list of children linked to this parent
router.get("/children", async (req, res) => {
  try {
    const parentId = await getParentId(req.user.userId);
    const children = await prisma.student.findMany({
      where: { parentId },
      include: { user: { select: { fullName: true, email: true } }, class: true },
    });
    res.json(children);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to load children." });
  }
});

// GET /api/parent/children/:studentId/performance — a specific child's grades
router.get("/children/:studentId/performance", async (req, res) => {
  try {
    const parentId = await getParentId(req.user.userId);

    // Confirm this student actually belongs to this parent
    const student = await prisma.student.findFirst({
      where: { id: req.params.studentId, parentId },
    });
    if (!student) {
      return res.status(403).json({ error: "This student is not linked to your account." });
    }

    const records = await prisma.performanceRecord.findMany({
      where: { studentId: req.params.studentId },
      include: { subject: true },
      orderBy: [{ year: "desc" }, { term: "desc" }],
    });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to load performance." });
  }
});

module.exports = router;

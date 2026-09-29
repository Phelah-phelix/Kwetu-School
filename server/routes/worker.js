const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth, requireRole("WORKER"));

router.get("/me", async (req, res) => {
  try {
    const worker = await prisma.worker.findUnique({
      where: { userId: req.user.userId },
      include: { user: { select: { fullName: true, email: true, phone: true } } },
    });
    if (!worker) return res.status(404).json({ error: "Worker profile not found." });
    res.json(worker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load profile." });
  }
});

module.exports = router;

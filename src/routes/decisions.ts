import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

/**
 * Create Decision
 */
router.post("/", async (req, res) => {
  const decision = await prisma.decision.create({
    data: req.body,
  });

  res.json(decision);
});

/**
 * List Decisions (for selector)
 */
router.get("/", async (req, res) => {
  const decisions = await prisma.decision.findMany({
    where: {
      title: { not: "" },
    },
    select: {
      id: true,
      title: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(decisions);
});

/**
 * Get Decision + Analyses
 */
router.get("/:id", async (req, res) => {
  const decision = await prisma.decision.findUnique({
    where: { id: req.params.id },
    include: { analyses: true },
  });

  if (!decision) return res.sendStatus(404);
  res.json(decision);
});

export default router;

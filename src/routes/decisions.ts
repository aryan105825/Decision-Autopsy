import { Router } from "express";
import { prisma } from "../prisma";
import { Request, Response } from "express";
import { paramToString } from "../utils/param";
const router = Router();

/**
 * Create Decision
 */
router.post("/", async (req: Request, res: Response) => {
  const decision = await prisma.decision.create({
    data: req.body,
  });

  res.json(decision);
});

/**
 * List Decisions (for selector)
 */
router.get("/", async (req: Request, res: Response) => {
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
router.get("/:id", async (req: Request, res: Response) => {
  const decision = await prisma.decision.findUnique({
    where: { id: paramToString(req.params.decisionId) },
    include: { analyses: true },
  });

  if (!decision) return res.sendStatus(404);
  res.json(decision);
});

export default router;

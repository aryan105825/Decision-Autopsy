import { Router } from "express";
import { prisma } from "../prisma";
import { runAnalysis } from "../ai/runAnalysis";
import { Request, Response } from "express";
import { paramToString } from "../utils/param";
const router = Router();

router.post("/:decisionId", async (req:Request, res:Response) => {
  const decision = await prisma.decision.findUnique({
where: { id: paramToString(req.params.decisionId) },
  });

  if (!decision) return res.sendStatus(404);

  const analysis = await runAnalysis(
    decision.structuredContext,
    decision.outcome
  );

  const saved = await prisma.analysis.create({
    data: {
      decisionId: decision.id,
      status: analysis.status,
      results: analysis.results,
      confidence: analysis.confidence,
      modelUsed: "llama-3.1-8b-instant",
    },
  });

  res.json(saved);
});

export default router;

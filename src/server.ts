import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./prisma";
import parseRoutes from "./routes/parse";
import analysisRoutes from "./routes/analysis";
import decisionRoutes from "./routes/decisions";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/parse", parseRoutes);
app.use("/decisions", decisionRoutes);
app.use("/analysis", analysisRoutes);
/**
 * Create Decision
 */
app.post("/decisions", async (req, res) => {
  const decision = await prisma.decision.create({
    data: req.body,
  });
  res.json(decision);
});

/**
 * Get Decision by ID
 */
app.get("/decisions/:id", async (req, res) => {
  const decision = await prisma.decision.findUnique({
    where: { id: req.params.id },
  });

  if (!decision) return res.sendStatus(404);
  res.json(decision);
});

/**
 * Attach Outcome (post-mortem)
 */
app.patch("/decisions/:id/outcome", async (req, res) => {
  const decision = await prisma.decision.update({
    where: { id: req.params.id },
    data: { outcome: req.body },
  });

  res.json(decision);
});

app.listen(4000, () => {
  console.log("API running on http://localhost:4000");
});

import { z } from "zod";

export const CoreAnalysisSchema = z.object({
  assumptionChecks: z.array(
    z.object({
      assumption: z.string(),
      analysis: z.string(),
    })
  ),
  possibleBiases: z.array(
    z.object({
      bias: z.string(),
      evidence: z.string(),
      confidence: z.number().min(0).max(1),
    })
  ),
  missingSignals: z.array(z.string()),
});

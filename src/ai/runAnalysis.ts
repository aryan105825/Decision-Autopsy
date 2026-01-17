import { groq } from "./groq";
import { CORE_ANALYSIS_PROMPT, SYNTHESIS_PROMPT } from "./analysisPrompts";
import { safeJsonParse } from "../utils/jsonSafeParse";
import { CoreAnalysisSchema } from "../validators/analysisSchema";

/**
 * Deterministic confidence calculation.
 * Confidence is derived from structure completeness, not model self-reporting.
 */
function computeConfidence(core: {
  assumptionChecks: any[];
  possibleBiases: any[];
  missingSignals: string[];
}) {
  let score = 1.0;

  // Penalize missing signals
  score -= core.missingSignals.length * 0.1;

  // Penalize high-confidence bias flags
  for (const b of core.possibleBiases) {
    if (b.confidence > 0.6) score -= 0.1;
  }

  // Penalize weak assumption coverage
  if (core.assumptionChecks.length === 0) {
    score -= 0.2;
  }

  // Clamp and round for stability
  return Math.max(0.2, Math.min(0.95, Number(score.toFixed(2))));
}

export async function runAnalysis(
  structuredContext: any,
  outcome?: any
) {
  try {
    // STEP 1: Core analysis
    const core = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: CORE_ANALYSIS_PROMPT },
        {
          role: "user",
          content: JSON.stringify({ structuredContext, outcome }),
        },
      ],
    });

    const rawCore = core.choices[0].message.content || "";
    const parsedCore = safeJsonParse(rawCore);
    const validated = CoreAnalysisSchema.safeParse(parsedCore);

    if (!validated.success) {
      return {
        status: "LOW_CONFIDENCE",
        results: parsedCore ?? { raw: rawCore },
        confidence: 0.4,
      };
    }

    // STEP 2: Synthesis
    const synth = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYNTHESIS_PROMPT },
        { role: "user", content: JSON.stringify(validated.data) },
      ],
    });

    const rawSynth = synth.choices[0].message.content || "";
    const parsedSynth = safeJsonParse(rawSynth);

    return {
      status: "COMPLETED",
      results: {
        ...validated.data,
        synthesis: parsedSynth,
      },
      confidence: computeConfidence(validated.data),
    };
  } catch (e) {
    return {
      status: "FAILED",
      results: { error: "Analysis execution failed" },
      confidence: 0.0,
    };
  }
}

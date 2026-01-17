"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAnalysis = runAnalysis;
const groq_1 = require("./groq");
const analysisPrompts_1 = require("./analysisPrompts");
const jsonSafeParse_1 = require("../utils/jsonSafeParse");
const analysisSchema_1 = require("../validators/analysisSchema");
/**
 * Deterministic confidence calculation.
 * Confidence is derived from structure completeness, not model self-reporting.
 */
function computeConfidence(core) {
    let score = 1.0;
    // Penalize missing signals
    score -= core.missingSignals.length * 0.1;
    // Penalize high-confidence bias flags
    for (const b of core.possibleBiases) {
        if (b.confidence > 0.6)
            score -= 0.1;
    }
    // Penalize weak assumption coverage
    if (core.assumptionChecks.length === 0) {
        score -= 0.2;
    }
    // Clamp and round for stability
    return Math.max(0.2, Math.min(0.95, Number(score.toFixed(2))));
}
async function runAnalysis(structuredContext, outcome) {
    try {
        // STEP 1: Core analysis
        const core = await groq_1.groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: analysisPrompts_1.CORE_ANALYSIS_PROMPT },
                {
                    role: "user",
                    content: JSON.stringify({ structuredContext, outcome }),
                },
            ],
        });
        const rawCore = core.choices[0].message.content || "";
        const parsedCore = (0, jsonSafeParse_1.safeJsonParse)(rawCore);
        const validated = analysisSchema_1.CoreAnalysisSchema.safeParse(parsedCore);
        if (!validated.success) {
            return {
                status: "LOW_CONFIDENCE",
                results: parsedCore ?? { raw: rawCore },
                confidence: 0.4,
            };
        }
        // STEP 2: Synthesis
        const synth = await groq_1.groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: analysisPrompts_1.SYNTHESIS_PROMPT },
                { role: "user", content: JSON.stringify(validated.data) },
            ],
        });
        const rawSynth = synth.choices[0].message.content || "";
        const parsedSynth = (0, jsonSafeParse_1.safeJsonParse)(rawSynth);
        return {
            status: "COMPLETED",
            results: {
                ...validated.data,
                synthesis: parsedSynth,
            },
            confidence: computeConfidence(validated.data),
        };
    }
    catch (e) {
        return {
            status: "FAILED",
            results: { error: "Analysis execution failed" },
            confidence: 0.0,
        };
    }
}

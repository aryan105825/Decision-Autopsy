"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreAnalysisSchema = void 0;
const zod_1 = require("zod");
exports.CoreAnalysisSchema = zod_1.z.object({
    assumptionChecks: zod_1.z.array(zod_1.z.object({
        assumption: zod_1.z.string(),
        analysis: zod_1.z.string(),
    })),
    possibleBiases: zod_1.z.array(zod_1.z.object({
        bias: zod_1.z.string(),
        evidence: zod_1.z.string(),
        confidence: zod_1.z.number().min(0).max(1),
    })),
    missingSignals: zod_1.z.array(zod_1.z.string()),
});

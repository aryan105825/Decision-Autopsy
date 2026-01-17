"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../prisma");
const runAnalysis_1 = require("../ai/runAnalysis");
const param_1 = require("../utils/param");
const router = (0, express_1.Router)();
router.post("/:decisionId", async (req, res) => {
    const decision = await prisma_1.prisma.decision.findUnique({
        where: { id: (0, param_1.paramToString)(req.params.decisionId) },
    });
    if (!decision)
        return res.sendStatus(404);
    const analysis = await (0, runAnalysis_1.runAnalysis)(decision.structuredContext, decision.outcome);
    const saved = await prisma_1.prisma.analysis.create({
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
exports.default = router;

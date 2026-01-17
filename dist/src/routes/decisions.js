"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../prisma");
const param_1 = require("../utils/param");
const router = (0, express_1.Router)();
/**
 * Create Decision
 */
router.post("/", async (req, res) => {
    const decision = await prisma_1.prisma.decision.create({
        data: req.body,
    });
    res.json(decision);
});
/**
 * List Decisions (for selector)
 */
router.get("/", async (req, res) => {
    const decisions = await prisma_1.prisma.decision.findMany({
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
    const decision = await prisma_1.prisma.decision.findUnique({
        where: { id: (0, param_1.paramToString)(req.params.decisionId) },
        include: { analyses: true },
    });
    if (!decision)
        return res.sendStatus(404);
    res.json(decision);
});
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const prisma_1 = require("./prisma");
const parse_1 = __importDefault(require("./routes/parse"));
const analysis_1 = __importDefault(require("./routes/analysis"));
const decisions_1 = __importDefault(require("./routes/decisions"));
const param_1 = require("./utils/param");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/parse", parse_1.default);
app.use("/decisions", decisions_1.default);
app.use("/analysis", analysis_1.default);
/**
 * Create Decision
 */
app.post("/decisions", async (req, res) => {
    const decision = await prisma_1.prisma.decision.create({
        data: req.body,
    });
    res.json(decision);
});
/**
 * Get Decision by ID
 */
app.get("/decisions/:id", async (req, res) => {
    const decision = await prisma_1.prisma.decision.findUnique({
        where: { id: (0, param_1.paramToString)(req.params.decisionId) },
    });
    if (!decision)
        return res.sendStatus(404);
    res.json(decision);
});
/**
 * Attach Outcome (post-mortem)
 */
app.patch("/decisions/:id/outcome", async (req, res) => {
    const decision = await prisma_1.prisma.decision.update({
        where: { id: (0, param_1.paramToString)(req.params.decisionId) },
        data: { outcome: req.body },
    });
    res.json(decision);
});
app.listen(4000, () => {
    console.log("API running on http://localhost:4000");
});

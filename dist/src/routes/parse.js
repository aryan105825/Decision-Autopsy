"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groq_1 = require("../ai/groq");
const parsePrompt_1 = require("../ai/parsePrompt");
const jsonSafeParse_1 = require("../utils/jsonSafeParse");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    const { rawContext } = req.body;
    const completion = await groq_1.groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            { role: "system", content: parsePrompt_1.PARSE_PROMPT },
            { role: "user", content: rawContext },
        ],
    });
    const raw = completion.choices[0].message.content || "";
    const parsed = (0, jsonSafeParse_1.safeJsonParse)(raw);
    if (!parsed) {
        return res.json({
            status: "LOW_CONFIDENCE",
            raw,
        });
    }
    res.json({
        status: "OK",
        parsed,
    });
});
exports.default = router;
